import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://visitation-backend-brhtgtatfubacuan.centralus-01.azurewebsites.net";

export async function getNearbyLocations(latitude, longitude, radius) {
    try {
        const response = await axios.get(`${backendUrl}/nearbylocations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params: { latitude, longitude, radius },
        });
        // Ensure response and response.data exist before returning
        console.log(response.data)
        return response?.data ?? null;  
    } catch (e) {
        console.error("Error fetching locations:", e);
        return null; // Return null or an empty object to prevent breaking the app
    }
}