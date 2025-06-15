import React, { useState, useCallback, useEffect, useRef } from "react";
import Slider from "../slider/slider";
import { useToast } from "../../context/toastContext";
import { useNavigate } from "react-router-dom";
import customFetch from "../../api";
import Loader from "../loader/loader";
// import Header from "../header/header";
import { useAuth } from "../../context/AuthContext";
import UserDetails from "../UserDetails/UserDetails";


// import UserDetails from "../userDetails/userDetails"; // assumed existing
import "./search.css";

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
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [results, setResults] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        
        if (!loading && isAuthenticated) {
            return;
        } else if (!loading && !isAuthenticated) {
            navigate("/login");
        }

    }, [loading]);

   
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
                    Toaster("Something went wrong", "error");
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
            {/* <Header isAuthenticated={isAuthenticated} /> */}

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
                    <Slider />
                </div>
            ) : (
                <div className="user-profile-box">
                    <button onClick={handleBackToSearch} className="btn btn-primary ms-2">Back to Search</button>
                    <UserDetails user={selectedUser} /> 
                </div>
            )}
        </>
    );
}
