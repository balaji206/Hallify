import React from 'react'; // ✅ Required in JSX files
import {Routes,Route} from 'react-router-dom'
import './index.css'
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import Signup from './components/signup.jsx';
import Login from './components/login.jsx';
import AddMahal from './components/addmahal.jsx';
import Profile from './components/profile.jsx';
import Mahaldetail from './components/mahaldetail.jsx';
import Mahals from './components/mahals.jsx';
import Filtermahal from './components/filterpage.jsx';
import UpdateMahal from './components/updatemahal.jsx';
import Booking from './components/Booking.jsx'; // ✅ Import Booking
import Brochure from './components/Brochure.jsx'; // ✅ Import Brochure
import Chat from './components/Chat.jsx'; // ✅ Import Chat
import MessageThreads from './components/MessageThreads.jsx'; // ✅ Import Threads

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/upload' element={<AddMahal/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/mahal/:id' element={<Mahaldetail/>}></Route>
        <Route path='/mahals' element={<Mahals/>}></Route>
        <Route path='/filter' element={<Filtermahal/>}></Route>
        <Route path="/update/:id" element={<UpdateMahal />} />
        <Route path="/book/:id" element={<Booking />} /> {/* ✅ Booking Page */}
        <Route path="/brochure/:id" element={<Brochure />} /> {/* ✅ Brochure Page */}
        <Route path="/chat/:mahalId/:ownerId" element={<Chat />} /> {/* ✅ Chat Page */}
        <Route path="/messages" element={<MessageThreads />} /> {/* ✅ Messages Dashboard */}
      </Routes>
    </div>
  );
}


export default App
