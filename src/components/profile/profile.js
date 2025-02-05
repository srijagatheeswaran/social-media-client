import Header from "../header/header"
import Slider from "../slider/slider"
import "./profile.css"
import { useState, useEffect } from 'react';
import Update from "./update/update";
import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../context/AuthContext";
import Post from "../../components/post/post";




export default function Profile() {

    const { isAuthenticated, checkAuth } = useAuth();

    const navigate = useNavigate()
    const [addClass, setAddClass] = useState(false);
    const [profileData, setProfileData] = useState({});
    // const email = "jagan@gmail.com"
    const [error, setError] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false)
    const [imageUrl, setImageUrl] = useState(
        "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"
    );
    const [imageData, setImageData] = useState(null);
    const [loader, setloader] = useState(true)
    const userEmail = localStorage.getItem("email")
    const token = localStorage.getItem("token")

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
        const showContant = ()=>{
        setloader(true)
        fetch('http://localhost:3000/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail
            })
        })
            .then(response => {
                if (!response.ok) {
                    setError(response.statusText);
                    setloader(false)

                }
                return response.json();
            })
            .then(data => {
                setProfileData(data);

                if (!data.image || data.image == "") {
                    setImageUrl("https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png")
                }
                else {
                    setImageUrl(data.image)
                }
                setloader(false)

                // console.log(data) 
            })
            .catch(err => {
                setError(err.message); // Handle any errors
                setloader(false)

            });}
            const handleLogin = async () => {
                // console.log(userEmail, token)
                const isValid = await checkAuth(userEmail, token);
                if (isValid) {
                    showContant()
                } else {
                    navigate("/home")
                }
            };
        handleLogin()

    }, [showUpdate]);
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                setImageData(dataUrl);
                // setImageUrl(dataUrl);
                // console.log(dataUrl)
                // console.log(imageData)
                handleUpload(dataUrl);


            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpload = (dataUrl) => {
        setloader(true)

        // Example API call to upload imageData to the backend
        fetch('http://localhost:3000/uploadImage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl, email: userEmail }) // Send data URL as JSON
        })
            .then(response => response.json())
            .then(data => {
                console.log('Image uploaded successfully:', data);
                setImageUrl(dataUrl);
                notifiysuccess('Image uploaded successfully')

                setloader(false)

            })
            .catch(error => {
                console.error('Error uploading image:', error);
                setloader(false)
                notifiyErr(error)
            });
    };
    function showUpdateHandle(e) {
        setAddClass(!addClass);
        if (e == "update") {
            setShowUpdate(!showUpdate)
        }

    }
    function Logout() {
        navigate("/login")
        localStorage.removeItem("email")
        localStorage.removeItem("token")

    }


    return <>
    {isAuthenticated ?
    <>
        <Header isAuthenticated={isAuthenticated} />
        <div className="profile">
                <Update showUpdateHandle={showUpdateHandle} addClass={addClass} email={userEmail} />
            {/* {showUpdate ? <Update showUpdateHandle={showUpdateHandle} addClass={addClass}  /> : null} */}
            <button className="btn btn-white" onClick={showUpdateHandle}><span>Edit</span> <i className="bi bi-pencil-square"></i></button>
            <button className="btn btn-danger" onClick={Logout} ><span>Logout</span><i className="bi bi-box-arrow-right"></i> </button>
            <div className="imgDiv">
                <label htmlFor="imgInput"><i className="bi bi-upload"></i></label>
                <input type="file" accept="image/*" id="imgInput" onChange={handleImageChange} />
                <img src={imageUrl} />
            </div>
            <div className="details">
                <div className="h1 name">{profileData.name}</div>
                <div className="p email">{profileData.email}</div>
                <p className="gender">{profileData.gender}</p>
                <p className="bio">{profileData.bio}</p>
            </div>
            <div className="AccountDetails">
                <div>
                    <div className="h1">POST</div>
                    <span className="h1">{profileData.postCount}</span>
                </div>
                <div>
                    <div className="h1">FOLLOWERS</div>
                    <span className="h1">{profileData.followersCount}</span>
                </div>
                <div>
                    <div className="h1">FOLLOWING</div>
                    <span className="h1">{profileData.followingCount}</span>
                </div>

            </div>
{/* <Post/> */}
            {loader ? <Loader /> : null}
        </div>
        <ToastContainer />
        <Slider /> </>: <Loader/>}
    </>
}