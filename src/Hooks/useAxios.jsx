import axios from 'axios';
import React from 'react';

const axiosAuth = axios.create({
    baseURL: `https://sendi-fly-server.vercel.app`
});

const useAxios = () => {
    return axiosAuth;
};

export default useAxios;