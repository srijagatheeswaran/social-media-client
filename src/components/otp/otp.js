import React, { useState, useRef, useEffect } from "react";
import "./otp.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../config';
import { useToast } from "../../context/toastContext";
import Loader from "../loader/loader"


const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const Toaster = useToast();
  const [loader, setLoader] = useState(false)


  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  function submitForm() {
    setLoader(true);

    const email = localStorage.getItem('email');

    if (!email) {
      setLoader(false);
      Toaster("Email not found in cookies", "error");
      return;
    }
    let otps = otp.join('')
    fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 'otp':otps, email })
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data }))) // Get status
      .then(({ status, body }) => {
        setLoader(false);
        if (status === 200) {
          Toaster(body.message || "OTP Verified Successfully!", "success");
          navigate("/home");
        } else if (status === 400) {
          Toaster(body.message || "Invalid OTP", "error");
        } else {
          Toaster("Something went wrong", "error");
        }
      })
      .catch(error => {
        setLoader(false);
        Toaster("Server error. Please try again.", "error");
        console.error("Error:", error);
      });
  }

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Enter OTP</h2>
        <p>We have sent a 6-digit code to your email</p>

        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={submitForm} disabled={loader}>
          {loader ? (<p className="message text-light m-0 loading-dots">Submitting<span> .</span><span> .</span><span> .</span></p>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* <p className="resend-text">
          Didn’t receive the code? <button className="resend-btn">Resend</button>
        </p> */}
      </div>
    </div>
  );
};

export default OTPVerification;
