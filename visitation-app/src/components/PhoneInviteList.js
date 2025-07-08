import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Phone } from 'lucide-react';
import PhoneInput from 'react-phone-number-input/input'
import { inviteUser } from '../services/authenticationServices'
import { useAuth } from '../providers/AuthProvider';
import './PhoneInviteList.css';

export default function PhoneInviteList() {
  const [phones, setPhones] = useState(['']);
  const { authState, login } = useAuth();

  const handleChange = (index, value) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
  };

  const addUser = () => {
    if (phones.length < 20) {
      setPhones([...phones, '']);
    }
  };

  const removeUser = (index) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated);
  };

  const handleSubmit = () => {
    phones.forEach(phone => {
      try {
        inviteUser(phone.slice(2), localStorage.getItem('token'));
      } catch (e) {
        console.log(e);
      }
    });
  }

  return (
    <div className="invite-container">
      <p className="instruction">
        Enter the phone numbers of up to 20 individuals you would like to invite.
      </p>
      {phones.map((phone, index) => (
        <div className="user-row" key={index}>
          <label>User {index + 1}</label>
          <div className="input-group">
            <PhoneInput
              country="US"
              value={phone}
              onChange={(value) => handleChange(index, value)}
            />
            {phones.length > 1 && (
              <button
                className="icon-btn"
                onClick={() => removeUser(index)}
                aria-label="Remove user"
              >
                <MinusCircle size={20} />
              </button>
            )}
          </div>
        </div>
      ))}
      {phones.length < 20 && (
        <button className="add-btn" onClick={addUser}>
          <PlusCircle size={20} style={{ marginRight: '6px' }} />
          Add a user
        </button>
      )}
      <button type="submit" onClick = {handleSubmit} className="send-invite-button"> Send Invite (SMS)</button>
    </div>
  );
}
