import './App.css';
import Home from './components/home/home';
import Login from './components/login/Login';
import Profile from './components/profile/profile';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Search from './components/search/search';
import Chat from './components/Chat/chat';


function App() {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>

    </BrowserRouter>
  
  </>
  );
}

export default App;
