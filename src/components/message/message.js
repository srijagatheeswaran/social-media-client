import './message.css';
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import BASE_URL from "../../config";
import { useParams, useNavigate } from 'react-router-dom';
import customFetch from "../../api";
import { useAuth } from "../../context/AuthContext";
import Loader from "../loader/loader";


export default function Message() {
    const { id } = useParams(); // receiverId
    const currentUserId = localStorage.getItem("id");
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const bottomRef = useRef(null);
    const scrollRef = useRef(null);
    const isInitialScroll = useRef(true);
    const { isAuthenticated, loading } = useAuth();
    const [loader, setloader] = useState(false)

    const navigate = useNavigate();

    // Scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    // Fetch paginated messages
    const fetchMessages = async () => {
        setloader(true);
        const { status, body } = await customFetch(`messages/${id}?page=${page}&limit=20`);
        if (body.message) {

        }
        if (body.otherUser) setOtherUser(body.otherUser);
        if (status !== 200 || !body.messages?.length) {
            setHasMore(false);
            setloader(false);

            return;
        }
        setMessages(prev => {
            const merged = [...body.messages, ...prev];
            const unique = Array.from(new Map(merged.map(m => [m._id, m])).values());
            return unique.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
        setloader(false);
        scrollToBottom();
    };

    // Auth & initial data load
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else {
                fetchMessages();
            }
        }
    }, [page, loading, isAuthenticated, navigate]);

    // Setup socket
    useEffect(() => {
        const newSocket = io(BASE_URL, { transports: ["websocket"] });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("register_user", currentUserId);
        });

        newSocket.on("private_message", (msg) => {
            setMessages(prev => {
                if (prev.some(m => m._id === msg._id)) return prev;
                const updated = [...prev, msg];
                return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            });
            scrollToBottom();
        });

        return () => newSocket.disconnect();
    }, [currentUserId]);

    // Scroll on new messages
    useEffect(() => {
        if (isInitialScroll.current) {
            isInitialScroll.current = false;
            scrollToBottom();
        }
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() || !socket) return;

        const newMsg = {
            _id: Date.now().toString(), // temporary unique ID
            sender: currentUserId,
            receiver: id,
            content: message,
            timestamp: new Date().toISOString(),
        };

        // Emit to server (don’t locally append to avoid duplicate from socket event)
        socket.emit("send_message", {
            senderId: currentUserId,
            receiverId: id,
            content: message,
            timestamp: newMsg.timestamp,
        });

        setMessage("");
        scrollToBottom();
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    if (loading) return <div className="loading text-light text-center w-100">Loading...</div>;
    // console.log(messages);
    return (
        <>
            {loader && <Loader />}
            <div className="message-page-container">
                {/* Header */}
                <div className="message-header">
                    <img
                        src={otherUser?.profileImage || "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"}
                        alt="User"
                        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
                    />
                    <h6 className="m-0">{otherUser?.username || "Unknown User"}</h6>
                </div>

                {/* Message List */}
                <div className="message-list-container" onScroll={handleScroll} ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender._id;
                            const receiverId = typeof msg.receiver === "string" ? msg.receiver : msg.receiver._id;
                            const isMine = senderId === currentUserId;

                            const isRelevant =
                                (senderId === currentUserId && receiverId === id) ||
                                (senderId === id && receiverId === currentUserId);

                            if (!isRelevant) return null;
                            return (
                                <div key={msg._id} className={`message-bubble ${isMine ? "sent" : "received"}`}>
                                    <p>{msg.content}</p>
                                    <span className="timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="message-send-container">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="message-send-btn" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
