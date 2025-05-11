import './App.css';
import Home from './components/home/home';
import Login from './components/login/Login';
import Profile from './components/profile/profile';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Search from './components/search/search';
import Chat from './components/Chat/chat';
import { ToastProvider } from './context/toastContext';
import { ToastContainer } from "react-toastify";
import Otp from './components/otp/otp'


function App() {
  return (<>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/otp-verification" element={<Otp />} />
        </Routes>

      </ToastProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

    </BrowserRouter>
  </>
  );
}

export default App;
