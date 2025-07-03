import './App.css';
import Home from './components/home/home';
import Login from './components/login/Login';
import Profile from './components/profile/profile';
import Register from './components/register/Register';
import Search from './components/search/search';
import Chat from './components/Chat/chat';
import Otp from './components/otp/otp';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastProvider } from './context/toastContext';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Message from './components/message/message';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/message/:id" element={<Message/>} />
            <Route path="/otp-verification" element={<Otp />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter >
  );
}

export default App;
