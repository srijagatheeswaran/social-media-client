import Header from "../header/header"
import Slider from "../slider/slider"
import "./profile.css"
import { useState, useEffect } from 'react';
import Update from "./update/update";
import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/toastContext";
import customFetch from "../../api";
import PostShow from "../post_show/post_show";
import Popup from '../Popup/Popup';
import ImageCropper from '../ImageCropper';
import { useRef } from 'react';






export default function Profile() {
    let Toaster = useToast();
    const navigate = useNavigate();
    const [addClass, setAddClass] = useState(false);
    const [posts, setPostdata] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [showUpdate, setShowUpdate] = useState(false)
    const [imageUrl, setImageUrl] = useState(
        "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"
    );
    const fileInputRef = useRef(null);
    // const [imageData, setImageData] = useState(null);
    const [loader, setloader] = useState(false)
    const [cropImage, setCropImage] = useState(null);

    const [postloader, setPostloader] = useState(false)
    const userEmail = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    const { isAuthenticated, loading } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [popupConfig, setPopupConfig] = useState(null);


    const [selectedPost, setSelectedPost] = useState(null);

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const handleClose = () => {
        setSelectedPost(null);
    };


    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchProfile();
            fetchPosts();
        } else if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return <Loader />;
    }

    const fetchProfile = async () => {
        try {
            setloader(true)
            const { status, body } = await customFetch("profile/show", {
                method: "GET",
            });

            if (status === 200) {
                // console.log("Profile Data:", body);
                setProfileData(body);
                // console.log(profileData);
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

    const fetchPosts = async () => {
        setPostloader(true)
        try {
            const { status, body } = await customFetch("posts/list", {
                method: "GET",
            });

            if (status === 200) {
                // console.log('post fetched')
                // console.log("Profile Data:", body);
                setPostdata(body.Posts);
                // console.log(posts);

            }
            else {
                console.error("Failed to fetch posts:", body.message);
                Toaster(body.message || "Failed to load posts", "error");
            }
        }
        catch (error) {
            console.error("Failed to fetch profile:", error);
            Toaster(error.message || "Network error", "error");
        } finally {
            setPostloader(false)

        }

    }

    //     const handleImageChange = (event) => {
    //     const file = event.target.files[0];

    //     if (file) {

    //         const previewUrl = URL.createObjectURL(file);
    //         setImageUrl(previewUrl); 
    // console.log("Selected file:", file);
    //         handleUpload(file); 
    //     }
    // };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCropImage(previewUrl);
        }
    };
    const handleCropComplete = (croppedFile) => {
        setCropImage(null); // hide cropper
        const previewUrl = URL.createObjectURL(croppedFile);
        setImageUrl(previewUrl); // preview cropped

        handleUpload(croppedFile); // upload cropped
    };

    const handleUpload = async (dataUrl) => {
        console.log("Uploading image:", dataUrl);
        try {
            setloader(true);

            // const { status, body } = await customFetch("profile/uploadImage", {

            //     method: "POST",
            //     body: JSON.stringify({ image: dataUrl, email: userEmail }),
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            const formData = new FormData();
            formData.append("image", dataUrl); // if it's a file, pass the file object
            formData.append("email", userEmail);

            const { status, body } = await customFetch("profile/uploadImage", {
                method: "POST",
                body: formData, 
            });

            if (status === 200) {
                // setImageUrl(dataUrl);
                fetchProfile();
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
        setPopupConfig({
            title: "Logout",
            message: "This action cannot be undone. Proceed?",
            confirmText: "Delete",
            cancelText: "Cancel",
            onConfirm: () => {
                setPostloader(true);
                setPostloader(false);
                setShowPopup(false);
                navigate("/login")
                localStorage.removeItem("email")
                localStorage.removeItem("token")
                localStorage.removeItem("id")
            },
            onCancel: () => setShowPopup(false)
        });
        setShowPopup(true);
    }
    function handleRemove(id) {

        setPopupConfig({
            title: "Delete Post",
            message: "This action cannot be undone. Proceed?",
            confirmText: "Delete",
            cancelText: "Cancel",
            onConfirm: () => {
                // console.log("Post deleted");
                setPostloader(true)
                customFetch(`posts/delete`, {
                    method: "DELETE",
                    body: JSON.stringify({ post_id: id }),
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Toaster("Post removed successfully", "success");
                            fetchPosts();
                            // console.log(posts);
                        } else {
                            Toaster("Failed to remove post", "error");
                        }
                    })
                    .catch((error) => {
                        console.error("Error removing post:", error);
                        Toaster(error.message || "Network error", "error");
                    })
                    .finally(() => {
                        setPostloader(false);
                    });
                setShowPopup(false);
            },
            onCancel: () => setShowPopup(false)
        });
        setShowPopup(true);

    }



    return <>
        <Header isAuthenticated={isAuthenticated} fetchPosts={fetchPosts} />
        {cropImage && (
            <ImageCropper
                imageSrc={cropImage}
                onCancel={() => setCropImage(null)}
                onCropComplete={handleCropComplete}
            />
        )}
        <div className="profile-container">
            <div className="profile">
                <Update showUpdateHandle={showUpdateHandle} fetchProfile={fetchProfile} addClass={addClass} data={profileData} />
                {/* {showUpdate ? <Update showUpdateHandle={showUpdateHandle} addClass={addClass}  /> : null} */}
                <button className="btn edit" onClick={showUpdateHandle}><span>Edit</span><i className="fa-solid fa-user-pen"></i></button>
                <button className="btn btn-danger" onClick={Logout} ><span>Logout</span><i className="bi bi-box-arrow-right"></i> </button>
                <div className="profile-contant-box">
                    <div className="profile-img-box col-6">
                        <div className="imgDiv">
                            <label htmlFor="imgInput"><i className="bi bi-upload"></i></label>
                            {/* <input type="file" accept="image/*" id="imgInput" onChange={handleImageChange} /> */}
                            <input
                                type="file"
                                accept="image/*"
                                id="imgInput"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <img src={imageUrl} />
                        </div>
                    </div>
                    <div className="details col-6">
                        <div className="h6 name">{profileData.name}</div>
                        <div className="p email">{profileData.email}</div>
                        <div className="sub-detail">
                           {profileData.gender&&<p className="gender">Gender : {profileData.gender}</p>} 
                           {profileData.bio&&<p className="bio">Bio : {profileData.bio}</p>} 
                           
                        </div>
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


            </div>
            <div className="post-box">

                <h6 className="post-head text-light text-center">Posts</h6>
                <div className="post-list">
                    <div className="posts-wrapper">
                        {posts.length > 0 ? (
                            posts.map((item, index) => (
                                <div className="post" key={index} onClick={() => handlePostClick(item)}>
                                    <div className="post-img-wrapper">
                                        <img src={item.media} alt="Post" className="post-img" />
                                        <button className="remove-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item._id);
                                        }}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-posts">
                                <p className="text-light text-center mt-2">No Posts Available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {postloader ? <Loader /> : null}

        </div>
        <Slider />
        {selectedPost && (

            <PostShow post={selectedPost} onClose={() => setSelectedPost(null)} />

        )}
        <Popup isOpen={showPopup} config={popupConfig} />
        {loader ? <Loader /> : null}
    </>
}