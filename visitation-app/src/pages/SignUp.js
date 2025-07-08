/* src/components/Login.js */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../providers/AuthProvider';
import { ChevronLeft } from "lucide-react"; 
import { createUser, getUserFromToken } from "../services/authenticationServices";
import './AuthScreen.css';
import './SignUp.css';

const SignUp = () => { 
  const [phone, setPhone] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const { authState, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.phoneOrEmail && !authState.phoneOrEmail.includes('@')) {
      setPhone(authState.phoneOrEmail);
    }
  }, [authState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(firstName, lastName, phone, password); 
    login(phone, password);
    navigate("/");
  };

  return (
    <div className="authenticate-container">
      <div className="authenticate-box">
        <div className="modal-header">
          <h3 className="modal-title"> User details </h3>
            <button onClick={() => {navigate(-1)}} className="close-button">
                <ChevronLeft size={40} />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="authenticate-form">
          <input
            type="input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="input"
            placeholder="First Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="phone"
            placeholder="Phone number"
            value={phone || ''}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="continue-button">Continue</button>
        </form> 
      </div>
    </div>
  );
};

export default SignUp;