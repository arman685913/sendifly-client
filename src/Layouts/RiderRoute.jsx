import React from 'react';
import Loader from '../Hooks/Loader';
import { Navigate } from 'react-router';
import useAxios from '../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../Hooks/useAuth';

const RiderRoute = ({ children }) => {
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

    const isRider = User?.role === 'rider';

    if (isLoading) {
        return <Loader></Loader>
    }

    if (!user || !isRider) {
        return <Navigate to="/dashboard/page not found" />;
    }

    return (
        children
    );
};

export default RiderRoute;