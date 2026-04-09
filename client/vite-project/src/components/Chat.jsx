import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Send, ArrowLeft, Building2, UserCircle2 } from "lucide-react";

/**
 * Chat Component
 * Handles private messaging between User and Owner.
 * Persists data to localStorage.
 */
function Chat() {
  const { mahalId, ownerId } = useParams();
  const [mahal, setMahal] = useState(null);
  const [owner, setOwner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatMeta, setChatMeta] = useState(null);
  const scrollRef = useRef(null);

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const chatId = `chat_${Math.min(currentUser?.id, ownerId)}_${Math.max(currentUser?.id, ownerId)}_${mahalId}`;

  // ✅ Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentUser) return;

    // 1. Fetch Mahal & Owner Info
    const fetchData = async () => {
      try {
        const mRes = await axios.get(`http://localhost:5000/api/mahal/get/${mahalId}`);
        setMahal(mRes.data);
        
        // Fetch owner info (using get user by id if available, else just use a placeholder)
        // For this demo, we'll just use "Venue Manager"
        setOwner({ fullName: "Venue Manager" });
      } catch (err) {
        console.error("Error fetching context:", err);
      }
    };
    fetchData();

    // 2. Load Messages from LocalStorage
    const loadMessages = () => {
      const allChats = JSON.parse(localStorage.getItem("hallify_chats") || "{}");
      if (allChats[chatId]) {
        const chatData = allChats[chatId];
        
        // Mark received messages as read
        const updatedMessages = chatData.messages.map(msg => {
          if (msg.senderId !== currentUser.id) {
            return { ...msg, unread: false };
          }
          return msg;
        });
        
        setMessages(updatedMessages);
        setChatMeta(chatData);
        
        // Save back as read
        allChats[chatId].messages = updatedMessages;
        localStorage.setItem("hallify_chats", JSON.stringify(allChats));
      }
    };
    loadMessages();

    // Listen for storage changes (updates from other "role" if on same machine)
    const handleStorage = () => loadMessages();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: inputText,
      timestamp: new Date().toISOString(),
      unread: true
    };

    const allChats = JSON.parse(localStorage.getItem("hallify_chats") || "{}");
    if (!allChats[chatId]) {
      allChats[chatId] = {
        mahalId,
        mahalName: mahal?.name || "Venue",
        ownerId,
        userName: currentUser.fullName,
        messages: []
      };
    }

    allChats[chatId].messages.push(newMessage);
    localStorage.setItem("hallify_chats", JSON.stringify(allChats));
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  if (!currentUser) return <div className="pt-32 text-center">Please login to chat.</div>;

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans flex flex-col">
      
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 fixed top-0 w-full z-40 shadow-sm pt-20 md:pt-4">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={mahal ? `/mahal/${mahalId}` : "/"} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-rose-900">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-800 shadow-inner">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-gray-900 leading-tight">
                  {mahal?.name || "Loading..."}
                </h2>
                <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                  {mahal?.owner_id === currentUser?.id 
                    ? `Direct message with ${chatMeta?.userName || "Guest"}`
                    : "Direct message with Owner"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto px-6 pt-44 pb-32 max-w-5xl mx-auto w-full space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-20 opacity-30 select-none">
            <MessageSquare size={64} className="mx-auto mb-4" />
            <p className="font-serif italic text-lg text-rose-900">Start the conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] md:max-w-[60%] flex flex-col ${msg.senderId === currentUser.id ? "items-end" : "items-start"}`}>
                <div className={`
                  px-5 py-3 rounded-[2rem] text-sm md:text-base shadow-sm
                  ${msg.senderId === currentUser.id 
                    ? "bg-rose-900 text-white rounded-tr-none" 
                    : "bg-white border border-rose-50 text-gray-800 rounded-tl-none"}
                `}>
                  {msg.text}
                </div>
                <span className="text-[9px] uppercase font-bold text-gray-400 mt-2 px-2 tracking-widest">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-[#fdfbf7]/80 backdrop-blur-md z-40 pb-8 pt-4">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto px-6 flex gap-4"
        >
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mahal?.owner_id === currentUser?.id 
              ? `Reply to ${chatMeta?.userName || "Guest"}...` 
              : "Type your message to the owner..."}
            className="flex-1 bg-white border border-rose-100 shadow-xl shadow-rose-900/5 rounded-full px-8 py-4 focus:outline-none focus:border-rose-400 transition-all placeholder-gray-400"
          />
          <button 
            type="submit"
            className="bg-rose-900 text-white p-4 rounded-full shadow-xl hover:bg-black hover:scale-110 transition-all"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
      
    </div>
  );
}

// Custom Import Mock
const MessageSquare = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default Chat;
