// components/Post.js
import React, { useState, useRef } from 'react';
import './post.css';
import { useToast } from "../../context/toastContext";
import Loader from '../loader/loader';
import customFetch from "../../api";
import ImageCropper from '../ImageCropper';

const Post = ({ addClass, setAddClass, showUpdateHandle, fetchPosts }) => {
  const Toaster = useToast();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const fileInputRef = useRef(null);
  const userEmail = localStorage.getItem("email");
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/";

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setCropImage(previewUrl); // Show cropper
    } else {
      Toaster("Please upload only images.", "error");
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedFile) => {
    setFile(croppedFile); // Save cropped image
    setCropImage(null);   // Hide cropper
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return Toaster("Please upload an image.", "error");
    if (!title.trim()) return Toaster("Please enter the title.", "error");

    const formData = new FormData();
    formData.append('image', file);
    formData.append('email', userEmail);
    formData.append('title', title);

    try {
      setLoader(true);
      const res = await fetch(`${BASE_URL}/posts/store`, {
        method: 'POST',
        body: formData,
        headers: {
          token: localStorage.getItem("token"),
          Email: userEmail,
        },
      });

      const body = await res.json();

      if (res.status === 200) {
        Toaster("Post uploaded successfully.", "success");
        setTitle('');
        setFile(null);
        fileInputRef.current.value = '';
        setAddClass(false);
        fetchPosts?.();
      } else {
        Toaster(body.message || "Post upload failed.", "error");
      }
    } catch (err) {
      console.error("Error uploading post:", err);
      Toaster(err.message || "Network error", "error");
    } finally {
      setLoader(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    fileInputRef.current.value = '';
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

      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
        />
      )}

      {loader && <Loader />}
    </div>
  );
};

export default Post;
