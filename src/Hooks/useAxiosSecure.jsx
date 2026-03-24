import React from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const useAxiosSecure = () => {
    const { user } = useAuth();

    const axiosSecure = React.useMemo(() => {
        const instance = axios.create({
            baseURL: "https://sendi-fly-server.vercel.app"
        });

        instance.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (res) => res,
            (error) => Promise.reject(error)
        );

        return instance;
    }, [user]); 

    return axiosSecure;
};

export default useAxiosSecure;