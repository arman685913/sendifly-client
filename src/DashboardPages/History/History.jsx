import React from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import HistoryTable from './HistoryTable';
import Loader from '../../Hooks/Loader';

const History = () => {


    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {isLoading , data: paymentsData = [] } = useQuery({
        queryKey: ['my-payment', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data;
        }
    })

    if(isLoading){
        return <Loader></Loader>
    }


    return (
        <div>
            <h2 className="Md:text-3xl text-2xl md:px-4 px-3 md:pt-3 pt-2 font-bold">Payments History</h2>
            <HistoryTable paymentsData={paymentsData} refetch={paymentsData}></HistoryTable>
        </div>
    );
};

export default History;