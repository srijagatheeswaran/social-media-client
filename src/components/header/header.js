import { useState } from "react";
import Post from "../post/post";
import"./header.css"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Header({isAuthenticated}) {
    const [addClass, setAddClass] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false)
    const navigate = useNavigate()

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
    function showUpdateHandle(e) {
        if(isAuthenticated){

            setAddClass(!addClass);
            if (e == "post") {
                setShowUpdate(!showUpdate)
            }
        }
        else{
            notifiyErr('Please Login')
        }

    }

    return <>
        <div className="header px-3">
            <h1>logo</h1>
            <div className="Top_box">
                {isAuthenticated?null:<button className="btn btn-primary" onClick={()=>navigate("/login")}>Login</button>}
                <div className="mx-2" onClick={showUpdateHandle}>
                    <i className="bi bi-plus-square"></i>
                    <p>Post</p>
                </div>
                
            </div>

        </div>
        <Post addClass={addClass} showUpdateHandle={showUpdateHandle}/>
    </>
}
export default Header;