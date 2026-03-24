import React from 'react';
import useAuth from '../Hooks/useAuth';
import Loader from '../Hooks/Loader';
import { Navigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../Hooks/useAxios';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { axios } = useAxios();
    if (loading) return <Loader></Loader>;

    const { isLoading, data: User = {} } = useQuery({
        queryKey: ['User'],
        queryFn: async () => {
            const res = await axios.get('/user')
            const userDb = res.data.find(userDB => userDB.email === user.email);
            return userDb;
        }
    })

    const isAdmin = User?.role === 'admin';

    if (isLoading) {
        return <Loader></Loader>
    }

    if (!user || !isAdmin) {
        return <Navigate to="/dashboard/page not found" />;
    }

    return (
        children
    );
};

export default AdminRoute;