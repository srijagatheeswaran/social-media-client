import React from 'react';

const UserDetails = ({ user }) => {
    return (
        <div className="user-details">
            <h2>User Details</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            {/* Add other user details as necessary */}
        </div>
    );
};

export default UserDetails;