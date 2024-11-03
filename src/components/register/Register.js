import './Register.css';
import { Link } from "react-router-dom";
import { useState ,useEffect} from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Loader from "../loader/loader";
import { useAuth } from '../../context/AuthContext';



function Register() {
    const [input, setInput] = useState({ username: "", email: "", password: "" })
    const [message,setMessage] = useState({})
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
        if (input.username.length < 3) newErrors.username = "Username must be at least 3 characters.";
        if (input.email.length < 0||!emailPattern.test(input.email)) newErrors.email = "Invalid email format.";
        if (input.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
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
    useEffect(() => {
        validateForm();
    }, [input]);
    function register(e) {
        e.preventDefault()
        // console.log(input)
        Object.values(errors).forEach((error) => {
            if(!error==''){
                notifiyErr(error);     
            }
        });
        console.log(errors)
        if (validateForm()) {
        setLoader(true)
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: input.username,
                    email: input.email,
                    password: input.password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    setLoader(false)
                    if(data.message=='User already exists'){
                        notifiyErr(data.message)
                    }
                    else{
                        notifiysuccess(data.message)
                        navigate("/home")
                        // console.log(data.token,data.email)
                        localStorage.setItem("email",data.email)
                        localStorage.setItem("token",data.token)
                    }
                } else {
                    setMessage('Registration failed');
                    notifiyErr('Registration failed')
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
            {loader?<Loader/>:null}
            <div className="text-center mt-4 name">
            REGISTER
            </div>
            <form className="p-3 mt-3">
                <div className="form-field d-flex align-items-center">
                    <span className="far fa-user"></span>
                    <input type="text" name="username" onChange={change} placeholder="Username" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fa-solid fa-envelope"></span>
                    <input type="email" name="email" onChange={change}  placeholder="Email"  />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fa-solid fa-key"></span>
                    <input type="password" name="password" onChange={change}  placeholder="Password"  />
                </div>
                {/* <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="password" name="re_password" onChange={change}  placeholder="Re-Password" />
                </div> */}
                <button className="btn mt-3" type="submit" onClick={register}>Sign up</button>
            </form>
            <div className="text-center fs-6">
                <p>I have a account?</p><Link to="/Login">Sign in</Link> 
            </div>
        </div>
        <ToastContainer />

    </>

}
export default Register;