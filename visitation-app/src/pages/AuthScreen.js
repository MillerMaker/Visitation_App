/* src/components/Login.js */
import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom'; 
import { checkPhoneOrEmailExists, getInvite } from '../services/authenticationServices'; // Import your API function 
import logo from '../assets/logo.png';
import './AuthScreen.css';
import { useAuth } from '../providers/AuthProvider';

const AuthScreen = ({inviteToken}) => {
  const [phoneOrEmail, setPhoneOrEmailInput] = useState('');
  const { setPhoneOrEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvite = async () => {
      if (inviteToken) {
        var {phoneNumber} = await getInvite(inviteToken);
        console.log(phoneNumber);
        setPhoneOrEmailInput(phoneNumber); 
      }
    };
    fetchInvite();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("phoneOrEmail", phoneOrEmail);
    if (await checkPhoneOrEmailExists(phoneOrEmail)) {
      setPhoneOrEmail(phoneOrEmail);
      navigate('/login');
      
    } else {
      setPhoneOrEmail(phoneOrEmail);
      navigate('/signup');
    } 
  };

  return (
    <div className="authenticate-container">
      <div className="authenticate-box">
        <div className="modal-header">
          <h3 className="modal-title"> Sign up or log in  </h3>
        </div>
        <img src={logo} alt="Logo" className="authenticate-logo" />
        <form onSubmit={handleSubmit} className="authenticate-form">
          <input
            type="phone"
            placeholder="phone number or email address"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmailInput(e.target.value)}
            required
          />
          <button type="submit" className="continue-button">Continue</button>
        </form> 
      </div>
    </div>
  );
};

export default AuthScreen;