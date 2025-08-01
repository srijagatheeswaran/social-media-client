import React, { useEffect, useState } from 'react';
import './UserDetails.css';
import customFetch from "../../api";
import { useToast } from "../../context/toastContext";
import Loader from '../loader/loader';

const UserDetails = ({ user }) => {
    const Toaster = useToast();
    const [userInfo, setUserInfo] = useState(null);
    const [isFollow, setIsFollow] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);
    const viewerEmail = localStorage.getItem("email");
    const [loader, setLoader] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoader(true);
            try {
                const { status, body } = await customFetch(`profile/user-details?email=${user.email}`, {
                    method: "GET",
                });

                if (status === 200) {
                    setUserInfo(body.user);
                    setIsFollow(body.isFollow);
                    setFollowersCount(body.followersCount || 0);
                    setFollowingCount(body.followingCount || 0);
                    setPostsCount(body.postsCount || 0);
                } else {
                    Toaster("Failed to load user details", "error");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                Toaster("Something went wrong", "error");
            }
            finally {
                setLoader(false);
            }
        };

        if (user?.email) {
            fetchUserDetails();
        }
    }, [user]);

    const handleFollow = async () => {
        setFollowLoading(true);
        try {
            const followData = {
                email: viewerEmail,
                user_id: userInfo._id,
            };
            const { status, body } = await customFetch("follow/store", {
                method: "POST",
                body: JSON.stringify(followData),
            });

            if (status === 200) {
                Toaster(body.message, "success");
                setIsFollow((prev) => !prev);
                setFollowersCount((prev) => isFollow ? prev - 1 : prev + 1);
            } else {
                Toaster("Failed to follow user", "error");
            }
        } catch (error) {
            console.error("Follow error:", error);
            Toaster("Follow action failed", "error");
        } finally {
            setFollowLoading(false);
        }
    };

    if (!userInfo) return <div className='text-light text-center'>Loading...</div>;

    return (
        <>
            <div className="user-details">
                <div className="user-details-box">
                    <img
                        className='user-image'
                        src={userInfo.profileImage || 'https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png'}
                        alt={`${userInfo.username}'s avatar`}
                    />
                    <div className='user-details-info'>
                        <button
                            className="btn btn-primary followbtn"
                            onClick={handleFollow}
                            disabled={followLoading}
                        >
                            {followLoading ? "Please wait..." : isFollow ? "Unfollow" : "Follow"}
                        </button>

                        <p>{userInfo.username}</p>
                        <p>{userInfo.email}</p>
                        <p>{userInfo.bio}</p>
                        <div className='user-stats'>
                            <p>Posts: {postsCount}</p>
                            <p>Following: {followingCount}</p>
                            <p>Followers: {followersCount}</p>
                        </div>

                        <button className='btn btn-primary mt-3' onClick={() => window.location.href = `/message/${userInfo._id}`}>Message</button>
                    </div>
                </div>
            </div>
            {loader && <Loader />}

        </>
    );
};

export default UserDetails;
