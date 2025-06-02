import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
