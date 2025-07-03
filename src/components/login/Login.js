import { useState, useEffect } from 'react';
import './Login.css';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/toastContext';
import customFetch from "../../api";



function Login() {


    const [input, setInput] = useState({ email: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const { isAuthenticated, checkAuth } = useAuth()
    const email = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    const Toaster = useToast()

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


    function login(e) {
        e.preventDefault();
        if (validateForm()) {
            const handleLogin = async () => {
                setLoader(true);

                try {
                    const { status, body } = await customFetch("auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: input.email,
                            password: input.password
                        })
                    });

                    setLoader(false);

                    if (status === 200) {
                        localStorage.setItem("email", body.email);
                        localStorage.setItem("token", body.token);
                        localStorage.setItem("id", body.id);
                        Toaster(body.message, "success");
                        navigate("/home");
                    } else if (status === 400) {
                        Toaster(body.message, "error");
                    } else if (status === 403) {
                        Toaster(body.message, "error");
                        localStorage.setItem("email", body.email);
                        navigate("/otp-verification");
                    } else {
                        Toaster("Something went wrong", "error");
                    }
                } catch (error) {
                    setLoader(false);
                    Toaster(error.message || "Network error", "error");
                    console.error("Error:", error);
                }   
            };
            handleLogin();
        }

    }


    return <>
        <div className='login_container'>
            <div className='center-box container'>
                <div className="text-center mt-4 h3">
                    Login
                </div>
                <form className="">
                    <div className="form-field d-flex align-items-center">
                        <span className="fa-solid fa-envelope"></span>
                        <input
                            type="text"
                            name="email"
                            onChange={change}
                            id="userName"
                            placeholder="Email"
                            className={errors.email ? `error` : ""}
                        />
                        {errors.email && <p className="text-danger m-0 ps-3 w-100">{errors.email}</p>}
                    </div>
                    <div className="form-field d-flex align-items-center">
                        <span className="fas fa-key"></span>
                        <input type="password" name="password" onChange={change} id="pwd" placeholder="Password"
                            className={errors.password ? `error` : ""} />
                        {errors.password && <p className="text-danger m-0 ps-3 w-100">{errors.password}</p>}
                    </div>
                    <button className="btn btn-light" onClick={login} disabled={loader}>Sign in</button>
                    {loader ? <p className="message text-danger m-0 loading-dots">Submitting<span> .</span><span> .</span><span> .</span></p> : null}
                </form>
                <div className="text-center ">
                    <div style={{ display: "flex", gap: "4px" }}>  <p className='mb-2'>Don't have a account?</p> <Link to="/Register" className='signupbtn'>Sign up</Link></div>
                </div>
            </div>
        </div>

    </>

}
export default Login;