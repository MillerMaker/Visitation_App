import './App.css';
import React, {useContext } from 'react';
import { BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import { WebSocketContext } from './providers/WebSocketProvider'; // Import the WebSocket context
import { AuthProvider } from './providers/AuthProvider'; // Import the AuthProvider
import { useGeolocation } from './hooks/useGeolocation'; // Import the custom hook
import AuthScreen from './pages/AuthScreen';
import AuthWithParams from './pages/AuthWithParams';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp'; 
import Home from './pages/Home';
import MapView from './pages/MapView';
import ToolBar from "./components/ToolBar"; 
import Users from "./pages/Users.js"
import ProtectedRoute from './components/ProtectedRoute.js';



function Layout() {
  return (
    <div className="app-container">
      <Outlet /> {/* This renders the child route */}
      <ToolBar /> {/* Always shown at the bottom */}
    </div>
  );
}

function App() {
  const { position } = useGeolocation(15000); // Update every 5 seconds

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/auth/:inviteToken" element={<AuthWithParams />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
