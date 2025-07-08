import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom';
import ChurchSummaryCard from '../components/ChurchSummaryCard';
import HomePageTools from '../components/HomePageTools';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [received, setReceived] = useState('');
    const socketRef = useRef<WebSocket | null>(null);
    const { logout } = useAuth();

    const startConnection = () => {
        // Check if socket is not already open
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        // Close existing connection if it exists
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Create new WebSocket connection
        const socket = new WebSocket('ws://localhost:5257');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            socketRef.current = socket;
        };

        socket.onmessage = (event) => {
            console.log('Received from server:', event.data);
            setReceived(event.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            socketRef.current = null;
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            socketRef.current = null;
        };
    };

    const sendMessage = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        } else {
            console.warn('WebSocket not connected.');
        }
    };

    return (
        <div>
            <div className = "main-content-home"> 
                <br></br>
                <br></br>
                <ChurchSummaryCard/> 
                <br></br>
                <br></br>
                <HomePageTools/> 
           </div>
        </div>
    );
};

export default Home;