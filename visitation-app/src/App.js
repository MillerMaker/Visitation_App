import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './providers/AuthProvider';

import AuthScreen from './pages/AuthScreen';
import AuthWithParams from './pages/AuthWithParams';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import MapView from './pages/MapView';
import ToolBar from './components/ToolBar';
import Users from './pages/Users.js';
import ProtectedRoute from './components/ProtectedRoute.js';



function Layout() {
  return (
    <div className="app-container">
      <Outlet /> {/* This renders the child route */}
      <ToolBar /> {/* Always shown at the bottom */}
    </div>
  );
}

function AppContent() {
  return (
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
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
