import { useState,useEffect} from 'react';
import './Login.css';
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';


function Login() {


    const [input, setInput] = useState({ email: '', password: '' })
    const [message, setMessage] = useState({})
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const { isAuthenticated, checkAuth } = useAuth()
    const email = localStorage.getItem("email")
    const token = localStorage.getItem("token")

    function change(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput((pre) => { return { ...pre, [name]: value } })
        setErrors((prev) => ({ ...prev, [name]: "" }));
        
    }
    const validateForm = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = {};
        if (!input.email || !emailPattern.test(input.email)) {
            newErrors.email = "Invalid email format.";
        }
    
        if (!input.password || input.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(()=>{
        const handleLogin = async () => {
            const isValid = await checkAuth(email, token);
            if (isValid) {
                navigate("/home")
            } 
        };
        handleLogin()
    },[])

    useEffect(() => {
        validateForm();
    }, [input]);
    function notifiyErr(err) {
        toast.error(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Flip,
        });
    }
    function notifiysuccess(data) {
        toast.success(data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
            transition: Flip,
        });
    }
    function login(e) {
        e.preventDefault()
        // console.log(input)
        Object.values(errors).forEach((error) => {
            if(!error==''){
                notifiyErr(error);     
            }
        });
        if (validateForm()){
            setLoader(true)
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: input.email,
                    password: input.password
                })
            })
                .then(response => response.json())
                .then(data => {
                    setLoader(false)
                    if (data.message) {
                        setMessage(data.message);
                        if (data.message == "Invalid User" || data.message == "Invalid password") {
                            notifiyErr(data.message)
                        }
                        else {
                            notifiysuccess(data.message)
                            navigate("/home")
                            // console.log(data.email,data.token)
                            localStorage.setItem("email",data.email)
                            localStorage.setItem("token",data.token)
                        }
    
                    } else {
                        setMessage('Login failed');
                        notifiyErr('Login failed')
                    }
                })
                .catch(error => {
                    setLoader(false)
                    notifiyErr(error)
                    console.error('Error:', error);
                    setMessage('An error occurred');
                });
    

        }

    }


    return <>
        <div className="wrapper">
            {loader ? <Loader /> : null}
            <div className="text-center mt-4 name">
                LOGIN
            </div>
            <form className="p-3 mt-3">
                <div className="form-field d-flex align-items-center">
                    <span className="fa-solid fa-envelope"></span>
                    <input type="text" name="email" onChange={change} id="userName" placeholder="Email" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="password" name="password" onChange={change} id="pwd" placeholder="Password" />
                </div>
                <button className="btn mt-3" onClick={login}>Sign in</button>
            </form>
            <div className="text-center fs-6">
                <p>Don't have a account?</p> <Link to="/Register">Sign up</Link>
            </div>
        </div>
        <ToastContainer />

    </>

}
export default Login;