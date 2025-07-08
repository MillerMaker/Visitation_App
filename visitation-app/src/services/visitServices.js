import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://visitation-backend-brhtgtatfubacuan.centralus-01.azurewebsites.net";

export async function newVisit(locationID, userID, visitOutcome, notes) {
    try {
        const response = await axios.post(
            `${backendUrl}/newvisit`, 
            {}, // Empty body since the backend expects query parameters
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    locationID,
                    userID,
                    visitOutcome,
                    notes,
                },
            }
        );
        // Ensure response and response.data exist before returning
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error adding a new visit:", e);
        return null; // Return null or an empty object to prevent breaking the app
    }
}

export async function getVisitsAtLocation(locationID) {
    try {
        const response = await axios.get(`${backendUrl}/visitsAtLocation`, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            params: { locationID },
        });    
        
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error fetching locations:", e);
        return null;
    }
}