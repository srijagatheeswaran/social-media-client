import { useEffect, useState } from "react";
import Post from "../post/post";
import "./header.css"
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from "../../context/toastContext";
import { useAuth } from "../../context/AuthContext";



function Header({ fetchPosts }) {
    const [addClass, setAddClass] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const { isAuthenticated, loading,verifyAuth } = useAuth();

    const navigate = useNavigate()
verifyAuth();
    const Toaster = useToast();
 if (loading) return null;
    function showUpdateHandle(e) {
        if (isAuthenticated) {

            setAddClass(!addClass);
            if (e == "post") {
                setShowUpdate(!showUpdate)
            }
        }
        else {
            console.log("Please Login")
            Toaster('Please Login', 'error')
        }

    }

    // if (loading) return <div className="loading text-light text-center">Loading...</div>;
    return <>
        <div className="header px-3">
            {/* <h1>logo</h1> */}
            <h5 className="logo-text">Social Media</h5>
            {/* <h1><img className="logo-img" src="/logo.png"/></h1> */}
            <div className="Top_box">
                {isAuthenticated ? null : <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>}
                <div className="mx-2" onClick={showUpdateHandle}>
                    <i className="bi bi-plus-square"></i>
                    <p>Post</p>
                </div>

            </div>

        </div>
        <Post addClass={addClass} setAddClass={setAddClass} fetchPosts={fetchPosts} showUpdateHandle={showUpdateHandle} />
    </>
}
export default Header;