import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://visitation-backend-brhtgtatfubacuan.centralus-01.azurewebsites.net";

export async function checkPhoneOrEmailExists(phoneOrEmail) {
    try {
        const response = await axios.get(`${backendUrl}/checkPhoneOrEmailExists`, {
            params: {phoneOrEmail},
        });
        // Ensure response and response.data exist before returning 
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error checking if user exists:", e);
        return null; // Return null or an empty object to prevent breaking the app
    }
}

export async function createUser(firstName, lastName, phone, password) {
    try {
        const response = await axios.post(`${backendUrl}/createUser`, {
            firstName,
            lastName,
            phone,
            password
        });
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error creating user:", e);
        return null;
    }
}

export async function getUserFromToken(token) {
    try {
        const response = await axios.get(`${backendUrl}/getUserFromToken`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // Ensure response and response.data exist before returning
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error getting user from token:", e);
        return null; // Return null or an empty object to prevent breaking the app
    }
}

export async function loginToBackend(phoneNumber, password) {
    try {
        const response = await axios.post(`${backendUrl}/login`, {
            phoneNumber,
            password
        });
        return response?.data ?? null;
    } catch (e) {
        console.error("Error logging in:", e);
        console.error("Error response:", e.response?.data);
        console.error("Error status:", e.response?.status);
        return null;
    }
}

export async function inviteUser(phoneNumber, token) { 
    try {
        const response = await axios.post(`${backendUrl}/inviteUser`, null, {
            params: {
                phoneNumber: phoneNumber
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // Return the invitation token from the response
        return response?.data ?? null;
    } catch (e) {
        console.error("Error inviting user:", e);
        return null; // Return null to prevent breaking the app
    }
}

export async function getInvite(inviteToken){
    try {
    const response = await axios.get(`${backendUrl}/getInvite`, {
        params: { inviteToken },
    });
    // Ensure response and response.data exist before returning
    return response?.data ?? null;  
    } catch (e) {
        console.error("Error getting invite token:", e);
        return null; // Return null or an empty object to prevent breaking the app
    }
}

