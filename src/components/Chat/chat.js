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
            }finally{
                setLoader(false);
            }
        };
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else {
                fetchMessages();
            }
        }
    }, [ loading, isAuthenticated, navigate]);

    // const currentUserId = "123";
    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io(BASE_URL, {
            transports: ["websocket"],
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected to socket:", newSocket.id);
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
            <div className="conversation-list">
                {messages.map((msg, index) => (
                    <div key={index} className="conversation-card" onClick={() => navigate(`/message/${msg.user._id}`)}>
                        <img
                            src={msg.user.profileImage}
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