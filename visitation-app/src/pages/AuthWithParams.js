/* src/components/Login.js */
import { useState} from 'react'; 
import {useParams} from 'react-router-dom';
import AuthScreen from './AuthScreen';

const AuthWithParams = () => {
  const {inviteToken} = useParams(); 
  return <AuthScreen inviteToken = {inviteToken}/>;
};

export default AuthWithParams;