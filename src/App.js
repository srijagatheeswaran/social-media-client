import './App.css';
import Home from './components/home/home';
import Login from './components/login/Login';
import Profile from './components/profile/profile';
import Register from './components/register/Register';
import { BrowserRouter, Routes, Route} from "react-router-dom"


function App() {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>

    </BrowserRouter>
  
  </>
  );
}

export default App;
