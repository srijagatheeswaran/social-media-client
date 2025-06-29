import React, { useState, useCallback, useEffect, useRef } from "react";
import Slider from "../slider/slider";
import { useToast } from "../../context/toastContext";
import { useNavigate } from "react-router-dom";
import customFetch from "../../api";
import Loader from "../loader/loader";
// import Header from "../header/header";
import { useAuth } from "../../context/AuthContext";
import UserDetails from "../UserDetails/UserDetails";
import PostShow from "../post_show/post_show";


// import UserDetails from "../userDetails/userDetails"; // assumed existing
import "./search.css";
import Header from "../header/header";

// Debounce function
const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

export default function Search() {
    const { isAuthenticated, loading } = useAuth();
    const Toaster = useToast();
    const [selectedPost, setSelectedPost] = useState(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [results, setResults] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const abortControllerRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const fetchPosts = async (page = 1, limit = 6) => {
        setLoader(true);
        try {
            const { status, body } = await customFetch(`posts?page=${page}&limit=${limit}`, {
                method: "GET",
            });

            if (status === 200) {
                setPosts(body.posts);
                setTotalPages(body.totalPages);
            } else {
                Toaster("Failed to fetch posts", "error");
            }
        } catch (error) {
            console.error("Fetch posts error:", error);
            Toaster("Error loading posts", "error");
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {

        if (!loading && isAuthenticated) {
            fetchPosts(page);
            return;
        } else if (!loading && !isAuthenticated) {
            navigate("/login");
        }


    }, [loading, isAuthenticated, page]);


    const fetchUsernames = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setResults([]);
                setIsDropdownOpen(false);
                setLoader(false);
                return;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            setLoader(true);
            try {
                const { status, body } = await customFetch(`profile/search?query=${query}`, {
                    method: "GET",
                    signal: controller.signal,
                });

                if (status === 200) {
                    // console.log("Fetched Usernames:", body.users);
                    setResults(body.users);
                    setIsDropdownOpen(true);
                } else {
                    setResults([]);
                    Toaster("No users found", "error");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching usernames:", error);
                    // Toaster("Something went wrong", "error");
                }
            } finally {
                setLoader(false);
            }
        }, 500),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setHighlightedIndex(-1);
        fetchUsernames(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            if (highlightedIndex >= 0 && highlightedIndex < results.length) {
                handleSelect(results[highlightedIndex]);
            }
        }
    };

    const handleSelect = (user) => {
        // console.log("Selected User:", user);
        setSelectedUser(user);
        setInputValue(user.username);
        setResults([]);
        setIsDropdownOpen(false);
    };

    const handleBackToSearch = () => {
        setSelectedUser(null);
        setInputValue("");
    };
    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Header />

            {loader && <Loader />}
            {!selectedUser ? (
                <div className="search-container">
                    {/* <h1>Search Users</h1> */}

                    <div className="search">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Search username"
                        />
                        {isDropdownOpen && (
                            <ol className="dropdown">
                                {results.length > 0 ? (
                                    results.map((user, index) => (
                                        <li
                                            key={user._id}
                                            onClick={() => handleSelect(user)}
                                            className={highlightedIndex === index ? "highlighted" : ""}
                                        >
                                            {user.username}
                                        </li>
                                    ))
                                ) : (
                                    <li className="no-results">No results found</li>
                                )}
                            </ol>
                        )}
                    </div>
                    <div className="search-post">
                        <div className="container">
                            {loading ? (
                                <div className="text-center my-5">
                                    <Loader />
                                </div>
                            ) : posts.length === 0 ? (
                                <p className="text-center text-muted">No posts available.</p>
                            ) : (
                                <div className="row search-row-box">
                                    {posts.map((post) => (
                                        <div key={post._id} className="col-md-4 search-post-main-box mb-4">
                                            <div className="card search-custom-post-card h-100">
                                                <img
                                                    src={post.media}
                                                    onClick={() => setSelectedPost(post)}
                                                    className="card-img-top"
                                                    alt={post.title}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Slider />
                </div>
            ) : (
                <div className="user-profile-box">
                    <button onClick={handleBackToSearch} className="btn btn-primary ms-2">Back to Search</button>
                    <UserDetails user={selectedUser} />
                </div>
            )}
            {selectedPost && (
                <PostShow
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>
    );
}
