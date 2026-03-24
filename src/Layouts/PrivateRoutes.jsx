import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Hooks/Loader';

const PrivateRoutes = ({ children }) => {
    
    const location = useLocation()

    const { user, loader } = useAuth();

    if (loader) {
        return <Loader></Loader>
    }


    if (!user) {
        return <Navigate state={location.pathname} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoutes;