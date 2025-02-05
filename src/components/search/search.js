import Slider from "../slider/slider";
import "./search.css";
import React, { useState, useCallback, useEffect,useRef  } from "react";
import debounce from "lodash.debounce";
import Loader from "../loader/loader"
import UserDetails from "../UserDetails/UserDetails";
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Search() {
    const [inputValue, setInputValue] = useState("");
    const [results, setResults] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // Index of the highlighted item
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loader, setLoader] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const loggedInUserEmail =localStorage.getItem("email")
    const searchRef = useRef(null);
    const abortControllerRef = useRef(null);

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
                const response = await fetch(
                    `http://localhost:3000/api/users/search?query=${query}&email=${loggedInUserEmail}`,
                    { signal: controller.signal }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setResults(data);
                        setIsDropdownOpen(true);
                    }
                    else {
                        setResults([]);
                        notifiyErr('No users found')
                        setIsDropdownOpen(false);
                    }
                } else {
                    console.error("Error fetching usernames:", response.statusText);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching usernames:", error);
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

        if (!value.trim()) {
            setResults([]);
            setIsDropdownOpen(false);
            fetchUsernames(value);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); 
            }
        } else {
            fetchUsernames(value); 
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prevIndex) =>
                prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
            );
        } else if (e.key === "Enter") {
            if (highlightedIndex >= 0 && highlightedIndex < results.length) {
                // handleSelect(results[highlightedIndex].username);
                handleSelect(results[highlightedIndex])
            }
        }
    };

    const handleSelect = (user) => {
        setSelectedUser(user);
        setInputValue(user.username);
        setResults([]);
        setHighlightedIndex(-1);
        setIsDropdownOpen(false);
    };
    const handleBackToSearch = () => {
        setSelectedUser(null);
        setInputValue("")
    };
    // useEffect(()=>{
    //     if(inputValue===""){
    //         setIsDropdownOpen

    //     }

    // },[inputValue])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
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

    return (
        <>
            {loader ? <Loader /> : null}
            {!selectedUser ? (
                <div>
                    <div className="search" ref={searchRef} >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Search username"
                        />
                        {isDropdownOpen && results.length > 0 && (
                            <ul>
                                {loader ? <Loader /> : null}
                                {results.map((user, index) => (
                                    <li
                                        key={user._id}
                                        onClick={() => handleSelect(user)}
                                        className={highlightedIndex === index ? "highlighted" : ""}
                                    >
                                        {user.username}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Slider />
                </div>
            ) : (
                <div>
                    <button onClick={handleBackToSearch}>Back to Search</button>
                    <UserDetails user={selectedUser} /> {/* Pass selected user to UserDetails */}
                </div>
            )}
            <ToastContainer/>
        </>
    );
}
