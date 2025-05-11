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
import { useToast } from "../../context/toastContext";
import Post from "../../components/post/post";
import BASE_URL from "../../config";
import customFetch from "../../api";






export default function Profile() {

    const { isAuthenticated, checkAuth } = useAuth();
    let Toaster = useToast()
    const navigate = useNavigate()
    const [addClass, setAddClass] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [error, setError] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false)
    const [imageUrl, setImageUrl] = useState(
        "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"
    );
    // const [imageData, setImageData] = useState(null);
    const [loader, setloader] = useState(false)
    const userEmail = localStorage.getItem("email")
    const token = localStorage.getItem("token")


    const fetchProfile = async () => {
        try {
            setloader(true)
            const { status, body } = await customFetch("profile/show", {
                method: "GET",
            });

            if (status === 200) {
                // console.log("Profile Data:", body);
                setProfileData(body);
                setImageUrl(body.image || imageUrl);
            }
            else {
                // console.error("Failed to fetch profile:", body.message);
                Toaster(body.message || "Failed to load profile", "error");
            }
            setloader(false)

        } catch (error) {
            setloader(false)
            console.error("Failed to fetch profile:", error);
            Toaster(error.message || "Network error", "error");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                setImageUrl(dataUrl);
                handleUpload(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    // const handleUpload = (dataUrl) => {
    //     setloader(true)

    //     fetch(`${BASE_URL}/uploadImage`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ image: dataUrl, email: userEmail })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Image uploaded successfully:', data);
    //             setImageUrl(dataUrl);
    //             Toaster('Image uploaded successfully', 'success')
    //             setloader(false)

    //         })
    //         .catch(error => {
    //             console.error('Error uploading image:', error);
    //             setloader(false)
    //             Toaster(error, "error")
    //         });
    // };
    const handleUpload = async (dataUrl) => {
        try {
            setloader(true);

            const { status, body } = await customFetch("profile/uploadImage", {
                method: "POST",
                body: JSON.stringify({ image: dataUrl, email: userEmail }),
            });

            if (status === 200) {
                setImageUrl(dataUrl);
                Toaster("Image uploaded successfully", "success");
            } else {
                Toaster(body.message || "Image upload failed", "error");
            }

        } catch (error) {
            console.error("Error uploading image:", error);
            Toaster(error.message || "Network error", "error");
        } finally {
            setloader(false);
        }
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
        {/* {isAuthenticated ? */}
        <>
            <Header isAuthenticated={isAuthenticated} />
            <div className="profile">
                <Update showUpdateHandle={showUpdateHandle} addClass={addClass} data={profileData} />
                {/* {showUpdate ? <Update showUpdateHandle={showUpdateHandle} addClass={addClass}  /> : null} */}
                <button className="btn edit" onClick={showUpdateHandle}><span>Edit</span><i className="fa-solid fa-user-pen"></i></button>
                <button className="btn btn-danger" onClick={Logout} ><span>Logout</span><i className="bi bi-box-arrow-right"></i> </button>
                <div className="imgDiv">
                    <label htmlFor="imgInput"><i className="bi bi-upload"></i></label>
                    <input type="file" accept="image/*" id="imgInput" onChange={handleImageChange} />
                    <img src={imageUrl} />
                </div>
                <div className="details">
                    <div className="h3 name">{profileData.name}</div>
                    <div className="p email">{profileData.email}</div>
                    <div className="sub-detail">
                        <p className="gender"><strong>Gender : </strong>{profileData.gender}</p>
                        <p className="bio"><strong>Bio : </strong>{profileData.bio}</p>
                    </div>
                </div>
                <div className="AccountDetails">
                    <div className="sub-box">
                        <span className="h1 pb-1">{profileData.postCount || 0}</span>
                        <div className="h1">POST</div>
                    </div>
                    <div className="sub-box">
                        <span className="h1 pb-1">{profileData.followersCount || 0}</span>
                        <div className="h1">FOLLOWERS</div>
                    </div>
                    <div className="sub-box">
                        <span className="h1 pb-1">{profileData.followingCount || 0}</span>
                        <div className="h1">FOLLOWING</div>
                    </div>

                </div>
                {/* <Post/> */}
                {loader ? <Loader /> : null}
            </div>
            <Slider /> </>
        {/* : ""} */}
    </>
}