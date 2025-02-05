import React, { useState } from 'react';
import './post.css';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/loader';

const Post = ({addClass,showUpdateHandle}) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [loader, setloader] = useState(false)
    const userEmail = localStorage.getItem("email")

    // Handle title input change
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
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

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Check if the file is an image or video
        if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
            setFile(selectedFile);
        } else {
            notifiyErr('Please upload only images or videos.')
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (file==null) {
            notifiyErr("Please upload an image.");
            return;
        }
        else if(title==''){
            notifiyErr("Please Enter the Tittle."); 
        }
        else{
            // console.log("Title:", title);
            // console.log("File:", file);
            const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result;
                    // setImageData(dataUrl);
                    handleUpload(dataUrl);
                    console.log(dataUrl)
    
    
                };
                reader.readAsDataURL(file);
        }


        // Further processing, like uploading the file and title
    };

    const handleUpload = (dataUrl) => {
        setloader(true)

        // Example API call to upload imageData to the backend
        fetch('http://localhost:3000/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl, email: userEmail }) // Send data URL as JSON
        })
            .then(response => response.json())
            .then(data => {
                console.log('Post uploaded successfully:', data);
                // setImageUrl(dataUrl);
                notifiysuccess('Post uploaded successfully')

                setloader(false)

            })
            .catch(error => {
                console.error('Error uploading image:', error);
                setloader(false)
                notifiyErr(error)
            });
    };

    // Handle file removal
    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div className={`post-container ${addClass?'showPost':""}`}>
            <div className='main-Box'>
            <i className="bi bi-x" onClick={()=>{showUpdateHandle("post")}}></i>
            <h2 className='head'>Create a New Post</h2>
            <form onSubmit={handleSubmit} className="post-form">

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="post-input img-input"
                    id="img-input"
                />
                <div className="post-Box">
                {file ? (
                    <div className="post-preview-container">
                        {file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} alt="Preview" className="post-preview" />
                        ) : (
                            <video controls className="post-preview">
                                <source src={URL.createObjectURL(file)} type={file.type} />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <button onClick={handleRemoveFile} className="post-remove-button">Remove</button>
                    </div>
                ) : <label htmlFor='img-input'><i className="bi bi-cloud-upload-fill"></i> <span>Upload Your File</span> </label>}
                </div>
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={handleTitleChange}
                    className="post-input"
                />
                <button type="submit" className="post-button">Post</button>
            </form>
            </div>
            {loader ? <Loader/> : null}
        </div>
        

    );
};

export default Post;
