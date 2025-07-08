import { useEffect, useRef, useState } from 'react'; 
import GenericBackPage from '../components/GenericBackPage'
import PhoneInviteList from '../components/PhoneInviteList'
import { useNavigate } from "react-router-dom"; 

const Users = () => {
    const navigate = useNavigate();
    
    return (
        <GenericBackPage title = "Invite Users" onBack = {() => {navigate(-1)}}> 
            <PhoneInviteList></PhoneInviteList>
        </GenericBackPage>
    );
};

export default Users;