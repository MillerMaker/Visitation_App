import { createContext, useState, useContext, useRef } from 'react'; 
import { getUserFromToken, loginToBackend } from '../services/authenticationServices'; // Import your JWT utility function

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(() => {
      // Check if there's a token in localStorage
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = getUserFromToken(token);
          console.log("Checking authentication. If we get here without an error ")
          return {
            isAuthenticated: true,
            userId: userData.UserID,
            orgId: userData.OrganizationID,
            phoneOrEmail: userData.phoneOrEmail,
          };
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        }
      }
      
      // Default state when no token exists or it's invalid
      return {
        isAuthenticated: false,
        userId: null,
        orgId: null,
        phoneOrEmail: null,
      };
      
    });

    const setPhoneOrEmail = (phoneOrEmail) => {
        setAuthState((prevState) => ({
            ...prevState,
            phoneOrEmail: phoneOrEmail,
        }))
    };
    

  const login = async (phone, password) => {
    var {token} = await loginToBackend(phone, password); 
    localStorage.setItem("token", token);
    
    // Extract user data from token and update state
    const userData = getUserFromToken(token);
    const newState = {
      isAuthenticated: true,
      userId: userData.UserID,
      orgId: userData.OrganizationID,
      phoneOrEmail: userData.phoneOrEmail,
    };
    setAuthState(newState);
    return newState;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      userId: null,
      orgId: null,
      phoneNumber: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, setPhoneOrEmail}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}