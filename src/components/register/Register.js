import './Register.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../config';
import { useToast } from "../../context/toastContext";
import customFetch from "../../api";




function Register() {
    const [input, setInput] = useState({ username: "", email: "", password: "", re_password: "" })
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState({});
    const email = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const Toaster = useToast();


    function change(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput((pre) => { return { ...pre, [name]: value } })
        setErrors((prev) => ({ ...prev, [name]: "" }));

    }
    const validateForm = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = {};

        if (!input.username || input.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters.";
        }

        if (!input.email || !emailPattern.test(input.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!input.password || input.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (!input.re_password || input.re_password.length < 6) {
            newErrors.re_password = "Confirm Password must be at least 6 characters.";
        }

        if (input.password !== input.re_password) {
            newErrors.re_password = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    function register(e) {
        e.preventDefault()
        // console.log(input)

        if (validateForm()) {
            const handleRegister = async () => {
                setLoader(true);

                try {
                    const { status, body } = await customFetch("auth/register", {
                        method: "POST",
                        body: JSON.stringify({
                            username: input.username,
                            email: input.email,
                            password: input.password
                        })
                    });

                    setLoader(false);

                    if (status === 200) {
                        Toaster(body.message, "success");
                        localStorage.setItem("email", body.email);
                        navigate("/otp-verification");
                    } else if (status === 400) {
                        Toaster(body.message, "error");
                    } else {
                        Toaster("Something went wrong", "error");
                    }
                } catch (error) {
                    setLoader(false);
                    Toaster(error.message || "Network error", "error");
                    console.error("Error:", error);
                }
            }
            handleRegister();
        }


    }


    return <>
        <div className='register-container'>
            <div className="center-box container">
                {/* {loader?<Loader/>:null} */}
                <div className="text-center mt-4 name h3">
                    Register
                </div>
                <form className="p-3 mt-3">
                    <div className="form-field d-flex align-items-center">
                        <span className="far fa-user"></span>
                        <input type="text" name="username" onChange={change} placeholder="Username" className={errors.username ? `error` : ""} />
                        {errors.username && <p className="text-danger m-0 ps-3 w-100">{errors.username}</p>}
                    </div>
                    <div className="form-field d-flex align-items-center">
                        <span className="fa-solid fa-envelope"></span>
                        <input type="email" name="email" onChange={change} placeholder="Email" className={errors.email ? `error` : ""} />
                        {errors.email && <p className="text-danger m-0 ps-3 w-100">{errors.email}</p>}
                    </div>
                    <div className="form-field d-flex align-items-center">
                        <span className="fa-solid fa-key"></span>
                        <input type="password" name="password" onChange={change} placeholder="Password" className={errors.password ? `error` : ""} />
                        {errors.password && <p className="text-danger m-0 ps-3 w-100">{errors.password}</p>}
                    </div>
                    <div className="form-field d-flex align-items-center">
                        <span className="fas fa-key"></span>
                        <input type="password" name="re_password" onChange={change} placeholder="Confirm Password" className={errors.re_password ? `error` : ""} />
                        {errors.re_password && <p className="text-danger m-0 ps-3 w-100">{errors.re_password}</p>}
                    </div>
                    <button className="btn btn-light" type="submit" onClick={register} disabled={loader}>Sign up</button>
                    {loader ? <p className="message text-danger m-0 loading-dots">Submitting<span> .</span><span> .</span><span> .</span></p> : null}

                </form>
                <div className="text-center fs-6">
                    <div style={{ display: "flex", gap: "4px" }}><p>I have a account?</p><Link to="/Login" className='signupbtn'>Log in</Link></div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    </>

}
export default Register;