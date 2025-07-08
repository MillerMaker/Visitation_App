import React, { createContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socket = useRef(null);

  useEffect(() => {
    try {
      if (socket.current) {
        socket.current.close();
      }

        socket.current = new WebSocket('ws://localhost:5257');
        
        try {
            socket.current.onopen = () => {
                console.log('WebSocket connected');
            };
        } catch (error) {
          console.error('Error creating WebSocket:', error);
        }


        socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Message from server:', data);
        // You can dispatch to state here if needed
        };

        // Cleanup function
        return () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.close();
            console.log('WebSocket closed');
        }
        };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
    
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};