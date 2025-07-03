import React from "react";
import "./UserListModal.css";
import { useState } from "react";

export default function UserListModal({ title, users, onClose,setSelectedUser }) {
       
    return (
        <>
            
                <div className="user-modal-overlay">
                    <div className="user-modal">
                        <div className="user-modal-header">
                            <h4>{title}</h4>
                            <button className="close-btn" onClick={onClose}>×</button>
                        </div>
                        <div className="user-modal-body">
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <div className="user-list-item" key={user._id} onClick={() => {setSelectedUser(user);onClose()}}>
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://www.pngfind.com/pngs/b/110-1102775_download-empty-profile-hd-png-download.png"
                                            }
                                            alt={user.username}
                                            className="user-avatar"
                                        />
                                        <span>{user.username}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No users found.</p>
                            )}
                        </div>
                    </div>
                </div>
            
        </>
    );
}
