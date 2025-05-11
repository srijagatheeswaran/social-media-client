import { useState } from "react";
import Post from "../post/post";
import "./header.css"
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from "../../context/toastContext";




function Header() {
    const [addClass, setAddClass] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false)
    const navigate = useNavigate()

    const Toaster = useToast();
    let isAuthenticated = true;

    function showUpdateHandle(e) {
        if (isAuthenticated) {

            setAddClass(!addClass);
            if (e == "post") {
                setShowUpdate(!showUpdate)
            }
        }
        else {
            Toaster('error', 'Please Login')
        }

    }

    return <>
        <div className="header px-3">
            <h1>logo</h1>
            <div className="Top_box">
                {isAuthenticated ? null : <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>}
                <div className="mx-2" onClick={showUpdateHandle}>
                    <i className="bi bi-plus-square"></i>
                    <p>Post</p>
                </div>

            </div>

        </div>
        {/* <Post addClass={addClass} showUpdateHandle={showUpdateHandle} /> */}
    </>
}
export default Header;