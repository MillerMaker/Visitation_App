/* src/components/Login.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "lucide-react";
import { useAuth } from '../providers/AuthProvider';
import logo from '../assets/logo.png'; 
import './Login.css'; // Import your CSS file
import './AuthScreen.css'; // Import your CSS file

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { authState, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Phone is currently: ", authState.phoneOrEmail, "\n Password is: ", authState.password)
      await login(authState.phoneOrEmail, password );
      if (authState.isAuthenticated) {
        navigate("/");
      } else {
        //login failed
        //show error message.
        console.log("Phone is currently: ", authState.phoneOrEmail, "\n Password is: ", authState.password)
        console.log("Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Check your credentials.');
      navigate("/auth");
    }
  };

  const goToForgot = () => {};

  return (
    <div className="authenticate-container">

      <div className="authenticate-box">

        <div className="modal-header">
          <button onClick={() => {navigate(-1)}} className="close-button">
              <ChevronLeft size={40} />
          </button>
          <h3 className="modal-title"> Enter password </h3>
        </div>

        <img src={logo} alt="Logo" className="authenticate-logo" />
        <form onSubmit={handleSubmit} className="authenticate-form">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="continue-button">Log In</button>
        </form>
        <button onClick={goToForgot} className="link-button">Forgot Password?</button>
      </div>
    </div>
  );
};

export default Login;