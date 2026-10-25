import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainBar from './components/navbar';
import Home from './pages/Homepage';
import Properties from './pages/Properties';
import SharedHomes from './pages/SharedHomes';
import Housemates from './pages/Housemates';
import Chats from './pages/Chats';
import Account from './pages/Dashboard';
import Register from './pages/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card,Button } from 'react-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <MainBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/shared-homes" element={<SharedHomes />} />
          <Route path="/housemates" element={<Housemates />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        </main>
        </BrowserRouter>
  );
}

export default App;

