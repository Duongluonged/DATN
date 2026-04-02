import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./components/layout/MainLayout";
import Home from './components/common/Home';    
import Login from './pages/Auth/Login';   
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;