import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft, Building2, UserCircle2, ChevronRight, Inbox } from "lucide-react";

/**
 * MessageThreads Component
 * Displays a list of all active chat conversations for the current user.
 */
function MessageThreads() {
  const [threads, setThreads] = useState([]);
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!currentUser) return;

    const loadThreads = () => {
      const allChats = JSON.parse(localStorage.getItem("hallify_chats") || "{}");
      const userThreads = [];

      Object.keys(allChats).forEach(chatId => {
        const chat = allChats[chatId];
        
        // Find threads where current user is a participant
        // In this local impl, chatId key includes participant IDs
        if (chatId.includes(`_${currentUser.id}_`)) {
          const lastMsg = chat.messages[chat.messages.length - 1];
          const unreadCount = chat.messages.filter(m => m.senderId !== currentUser.id && m.unread).length;
          
          userThreads.push({
            id: chatId,
            mahalId: chat.mahalId,
            mahalName: chat.mahalName,
            otherParticipant: chat.ownerId == currentUser.id ? chat.userName : "Venue Manager",
            lastMessage: lastMsg?.text || "No messages yet",
            timestamp: lastMsg?.timestamp || new Date().toISOString(),
            unreadCount: unreadCount,
            otherId: chat.ownerId == currentUser.id ? chat.messages.find(m => m.senderId != currentUser.id)?.senderId : chat.ownerId
          });
        }
      });

      // Sort by latest message
      userThreads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setThreads(userThreads);
    };

    loadThreads();
    window.addEventListener("storage", loadThreads);
    return () => window.removeEventListener("storage", loadThreads);
  }, []);

  if (!currentUser) return <div className="pt-32 text-center">Please login to view messages.</div>;

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans pb-24">
      
      {/* Inbox Header */}
      <div className="bg-rose-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/profile" className="inline-flex items-center gap-2 text-rose-200 hover:text-white transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
              <Inbox size={40} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight mb-1">My Inbox</h1>
              <p className="text-rose-200 font-bold uppercase tracking-[0.2em] text-[10px]">
                {threads.length} active conversations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* Threads List */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl shadow-rose-900/5 border border-gray-100">
              <MessageSquare size={64} className="mx-auto mb-6 opacity-10" />
              <p className="text-gray-400 font-serif italic text-xl">No conversations yet.</p>
              <Link to="/mahals">
                <button className="mt-8 text-rose-800 font-bold uppercase tracking-widest text-xs border-b-2 border-rose-800 pb-1 hover:text-rose-600 hover:border-rose-600 transition-all">
                  Browse Venues to start chatting
                </button>
              </Link>
            </div>
          ) : (
            threads.map((thread) => (
              <Link 
                key={thread.id} 
                to={`/chat/${thread.mahalId}/${thread.otherId}`}
                className="group block"
              >
                <div className="bg-white rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-xl shadow-rose-900/5 border border-gray-100 group-hover:border-rose-200 group-hover:translate-x-1 transition-all">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-800">
                        <Building2 size={30} />
                      </div>
                      {thread.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {thread.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-gray-900 text-lg truncate uppercase">
                          {thread.mahalName}
                        </h3>
                        {thread.unreadCount > 0 && (
                          <span className="bg-rose-100 text-rose-700 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm font-medium mb-1 truncate">
                        Talking to: <span className="text-rose-900 font-bold">{thread.otherParticipant}</span>
                      </p>
                      <p className={`text-sm truncate ${thread.unreadCount > 0 ? "text-gray-900 font-bold italic" : "text-gray-400"}`}>
                        "{thread.lastMessage}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest whitespace-nowrap">
                      {new Date(thread.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-rose-900 group-hover:text-white transition-all shadow-inner group-hover:shadow-lg">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default MessageThreads;
