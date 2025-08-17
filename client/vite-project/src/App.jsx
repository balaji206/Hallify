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

      </Routes>
    </div>
  );
}


export default App
