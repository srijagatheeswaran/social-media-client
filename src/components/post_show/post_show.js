import React, { useEffect } from 'react';
import './post_show.css';

export default function PostShow({ post, onClose }) {
    useEffect(() => {
        postView(post._id); // Trigger the view function when the component mounts
    }, [post]);

    const postView = (id) => {
        console.log("Post viewed:", id);
    };

    return (

        <div className="post-modal">
            <i className="bi bi-x close-icon text-light" onClick={onClose}></i>
            <div className="post-modal-content">
                <img src={post.media} alt={post.title} className="post-full-img" />
                <p>{post.title}</p>
                <p>{post.description}</p>
            </div>
        </div>

    );
}
