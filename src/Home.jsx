import React from 'react';
import './Home.css';
import {useNavigate} from 'react-router-dom';

function Home(){


    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/signin');
    }
    return(
        <div>
            <div className="nav-bar">
                <img src="src/assets/message.png" ></img>
                <h1> Web messenger</h1>
                <button type='button' onClick = {handleLoginClick}>Log in</button>
            </div>

            <div className="mid-div">
                <h2>Message anyone , anywhere across the web</h2>
                <h3>You can chat with anyone across the web using Web Messenger
                    . It allows you to add other users as your friends by using their username.
                    You can chill / discuss with friends and build a great community.
                </h3>
            </div>
        </div>
    );
}

export default Home;