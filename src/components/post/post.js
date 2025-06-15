import React, { useState, useRef } from 'react';
import './post.css';
import { useToast } from "../../context/toastContext";
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/loader';
import customFetch from "../../api";

const Post = ({ addClass, setAddClass, showUpdateHandle, fetchPosts }) => {
    const Toaster = useToast();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [loader, setloader] = useState(false);
    const fileInputRef = useRef(null);
    const userEmail = localStorage.getItem("email");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            Toaster("Please upload only images.", "error");
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            Toaster("Please upload an image.", "error");
            return;
        }

        if (!title.trim()) {
            Toaster("Please enter the title.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result;
            handleUpload(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (dataUrl) => {
        try {
            setloader(true);
            const { status, body } = await customFetch("posts/store", {
                method: "POST",
                body: JSON.stringify({ image: dataUrl, email: userEmail, title }),
            });

            if (status === 200) {
                Toaster("Post uploaded successfully.", "success");
                setTitle('');
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setAddClass(false);
                if (fetchPosts) {
                    fetchPosts();
                }
            } else {
                Toaster(body.message || "Post upload failed.", "error");
            }
        } catch (error) {
            console.error("Error uploading post:", error);
            Toaster(error.message || "Network error", "error");
        } finally {
            setloader(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={`post-container ${addClass ? 'showPost' : ""}`}>
            <div className='main-Box'>
                <i className="bi bi-x post_remove_btn" onClick={() => showUpdateHandle("post")}></i>
                <h2 className='head'>Create a New Post</h2>
                <form onSubmit={handleSubmit} className="post-form">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="post-input img-input"
                        id="img-input"
                    />
                    <div className="post-Box">
                        {file ? (
                            <div className="post-preview-container">
                                <img src={URL.createObjectURL(file)} alt="Preview" className="post-preview" />
                                <button type="button" onClick={handleRemoveFile} className="post-remove-button">
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        ) : (
                            <label htmlFor='img-input'>
                                <i className="bi bi-cloud-upload-fill"></i>
                                <span>Upload Your File</span>
                            </label>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={handleTitleChange}
                        className="post-input"
                    />
                    <button type="submit" className="post-button">Upload</button>
                </form>
            </div>
            {loader && <Loader />}
        </div>
    );
};

export default Post;
