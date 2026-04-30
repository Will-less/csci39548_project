import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import NavBar from "./Components/Navbar";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Library from './Pages/Library';
import Texthooker from './Pages/Texthooker';
import Nil from './Components/Nil';
import Footer from "./Components/Footer";


function App() {

  const location = useLocation();
  const excludeFooter = "/Texthooker";

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Library" element={<Library />} />
        <Route path="/Texthooker" element={<Texthooker />} />
        <Route path="*" element={<Nil />} />
      </Routes>
      {location.pathname !== excludeFooter && <Footer />}
    </>
  )
}

export default App
