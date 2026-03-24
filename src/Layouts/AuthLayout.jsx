import React from 'react';
import authImage from '../assets/authImage.png'
import Logo from '../assets/Logo.png'
import { Link, Outlet } from 'react-router';

const AuthLayout = () => {


    return (
        <div className='max-w-7xl mx-auto min-h-screen'>
            <div className='w-11/12 mx-auto my-5'>
                <Link to="/" >
                    <img
                        src={Logo}
                        className="lg:w-36 w-30"
                    />
                </Link>
            </div>
            <div className="w-11/12 mx-auto bg-base-200 ">
                <div className="hero-content flex-col lg:flex-row-reverse rounded-2xl border-lime-500 border-3">
                    <div className='flex-1'>
                        <img
                            src={authImage}
                            className="not-dark:bg-lime-50"
                        />
                    </div>

                    <div className='flex-1'>

                        <Outlet></Outlet>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;