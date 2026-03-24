import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import ParcelTable from './ParcelTable';
import Loader from '../Hooks/Loader';

const MyParcels = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: parcels = [], refetch } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`)
            return res.data;
        }
    })

    if (isPending) {
        return <Loader></Loader>
    }

    return (
        <div>
            <h2 className="Md:text-3xl text-2xl md:px-4 px-3 md:pt-3 pt-2 font-bold ">All Parcels</h2>
            <ParcelTable refetch={refetch} parcels={parcels}></ParcelTable>
        </div>
    );
};

export default MyParcels;