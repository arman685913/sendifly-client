import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/shared/Navbar';
import Footer from '../Pages/shared/Footer';
import Loader from '../Hooks/Loader';

const Root = () => {


    return (
        <div className='max-w-7xl mx-auto px-1 light:bg-mauve-100 bg-base-200 dark:text-white pt-3'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;



