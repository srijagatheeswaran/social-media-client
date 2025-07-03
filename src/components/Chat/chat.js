import Slider from "../slider/slider";
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import BASE_URL from "../../config";
import customFetch from "../../api";
import './chat.css';
import Header from "../header/header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import Loader from "../loader/loader";

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loader, setLoader] = useState(false);
    const [recipientId, setRecipientId] = useState('');
    const currentUserId = localStorage.getItem('id');
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const fetchMessages = async () => {
        setLoader(true);
        try {
            const { status, body } = await customFetch("messages/list");

            if (status === 200) {
                setMessages(body.messages);
            } else {
                console.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoader(false);
        }
    };
    const fetchSuggestedUsers = async () => {
        try {
            const { status, body } = await customFetch("follow/suggested-users");
            if (status === 200) {
                setSuggestedUsers(body.users);
            }
        } catch (error) {
            console.error("Error fetching suggested users", error);
        }
    };

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchMessages();
            fetchSuggestedUsers();
        }
    }, [loading, isAuthenticated]);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else {
                fetchMessages();
            }
        }
    }, [loading, isAuthenticated, navigate]);

    // const currentUserId = "123";
    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io(BASE_URL, {
            transports: ["websocket"],
        });

        newSocket.on("connect", () => {
            // console.log("✅ Connected to socket:", newSocket.id);
            newSocket.emit("register_user", currentUserId);
        });

        // Register the current user
        // newSocket.emit('register_user', currentUserId);

        // Listen for incoming private messages
        newSocket.on('register_user', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => newSocket.close();
    }, [currentUserId]);


    return (

        <>
            {loading && <Loader />}
            {loader && <Loader />}
            <Header />
            {suggestedUsers.length === 0 && messages.length === 0 && !loader && !loading && (
                <div className="text-center text-light mt-5">
                    <h5>Follow users to start chatting.</h5>
                </div>
            )}
            {suggestedUsers.length > 0 && (
                <div className="suggested-users">
                    <h5 className="text-light px-3 mt-2">Suggested</h5>
                    <div className="d-flex overflow-auto px-3 mb-3">
                        {suggestedUsers.map(user => (
                            <div
                                key={user._id}
                                className="suggested-user-card "
                                onClick={() => navigate(`/message/${user._id}`)}
                            >
                                <img
                                    src={user.profileImage || "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"}
                                    className="suggested-avatar"
                                    alt={user.username}
                                />
                                {/* <p className="text-center text-light">{user.username}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="conversation-list">
                {messages.map((msg, index) => (
                    <div key={index} className="conversation-card" onClick={() => navigate(`/message/${msg.user._id}`)}>
                        <img
                            src={msg.user.profileImage || "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"}
                            alt={msg.user.username}
                            className="conversation-avatar"
                        />
                        <div className="conversation-info">
                            <div className="conversation-header">
                                <h5>{msg.user.username}</h5>
                                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="last-message">{msg.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <Slider />
        </>

    )
}