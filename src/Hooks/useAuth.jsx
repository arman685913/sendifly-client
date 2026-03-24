import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../Firebase/AuthProvider';

const useAuth = () => {
    const authInfo = useContext(AuthContext)
    return authInfo;
};

export default useAuth;