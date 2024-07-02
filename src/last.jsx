import React, { useState, useEffect } from 'react';
import './last.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function Last() {
    const [file, setFile] = useState(null);
    const [userProfilePic, setUserProfilePic] = useState('');

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            try {
                const username = Cookies.get('username'); // Assuming you stored username in cookie
                const response = await axios.get(`http://localhost:5000/api/user/${username}`);
                const profilePicFilename = response.data.profilePicFilename; // Adjust this based on your backend response structure
                setUserProfilePic(profilePicFilename);
                console.log(profilePicFilename);
            } catch (error) {
                console.error('Error fetching user profile picture:', error);
            }
        };

        fetchUserProfilePic(); // Call the function once after the component mounts
    }, []); // Empty dependency array ensures it runs only once after mount

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
    
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const username = Cookies.get('username'); // Assuming you stored username in cookie

            const response = await axios.post(`http://localhost:5000/api/upload/${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update user profile picture URL after successful upload
            setUserProfilePic(response.data.profilePicFilename);

            // Optionally, update UI to indicate successful upload
            alert('Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to update profile picture');
        }
    };

    return (
        <div className="outer-div">
            <div className="left-div">
                <p>Sfsfs</p>
            </div>
            <div className="right-div">
                <p>Asfsaf</p>
            </div>
            <div className="right-right-div">
                <div id="user-pfp" style={{ backgroundImage: `url(/backend/uploads/${userProfilePic})` }}></div>
                <div id="great">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div>
                    <button onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
}

export default Last;
