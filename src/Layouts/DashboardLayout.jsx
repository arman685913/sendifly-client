import React from 'react';
import { Link, Outlet } from 'react-router';
import logo from '../assets/Logo.png'
import { NavLink } from 'react-router';
import { FaHome, FaBoxOpen, FaHistory, FaSearchLocation, FaUserEdit, FaBoxes, FaSearch, FaUser, FaUserCheck, FaUserClock, FaUserShield, FaTruck, FaCheckCircle, FaCoins } from "react-icons/fa";
import Loader from '../Hooks/Loader';
import ToggleTheme from '../Pages/ToggleTheme/ToggleTheme'
import { useQuery } from '@tanstack/react-query';
import useAuth from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiosSecure';


const DashboardLayout = () => {

    const axios = useAxiosSecure()
    const { user } = useAuth()


    const { isLoading, data: User = {} } = useQuery({
        queryKey: ['User'],
        queryFn: async () => {
            const res = await axios.get(`/user/${user.email}`)
            const userDb = res.data;
            return userDb;
        }
    })

    if (isLoading) {
        return <Loader></Loader>
    }

    // console.log(User)


    return (
        <div className="drawer  lg:drawer-open">
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />

            {/* Content Area */}
            <div className="drawer-content  flex flex-col">

                {/* Navbar */}
                <div className="navbar lg:hidden bg-base-300 w-full">

                    {/* Mobile menu button */}
                    <div className="flex-none  lg:hidden">
                        <label
                            htmlFor="main-drawer"
                            className="btn btn-square btn-ghost drawer-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>
                    </div>

                    <div className="mx-2 flex-1 px-2 font-semibold">
                        Dashboard
                    </div>

                    {/* Desktop navbar items */}
                    <div className="hidden lg:block">
                        <ul className="menu menu-horizontal">
                            <li><a>Home</a></li>
                            <li><a>Profile</a></li>
                        </ul>
                    </div>

                </div>

                {/* Page Content */}
                <div>
                    <Outlet></Outlet>
                </div>

            </div>

            {/* Sidebar */}
            <div className="drawer-side border-gray-300 border-r">
                <label htmlFor="main-drawer" className="drawer-overlay"></label>

                <ul className="menu bg-base-200 min-h-full w-64 p-4">
                    <div className='flex justify-between items-center'>
                        <Link to='/'>
                        <img src={logo} className='w-30 lg:w-36' alt="" />
                        </Link> 
                        <ToggleTheme />
                    </div>

                    <li>
                        <NavLink to="/dashboard" className="flex items-center gap-2">
                            <FaHome />
                            Home
                        </NavLink>
                    </li>
                    {User.role !== 'admin' &&
                        <li >
                            <NavLink to="/dashboard/myParcels" className="flex items-center gap-2">
                                <FaBoxOpen />
                                My Parcels
                            </NavLink>
                        </li>
                    }
                    <li>
                        <NavLink to="/dashboard/payments/history" className="flex items-center gap-2">
                            <FaHistory />
                            History
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/payments/track" className="flex items-center gap-2">
                            <FaSearch />
                            Track Parcel
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/profile" className="flex items-center gap-2">
                            <FaUserEdit />
                            Update Profile
                        </NavLink>
                    </li>

                    {/* rider */}
                    {
                        User.role === 'rider' && (
                            <>
                                <li>
                                    <NavLink to="/dashboard/PendingDeliveries" className="flex items-center gap-2">
                                        <FaTruck />
                                        Pending Deliveries
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/CompleteDeliveries" className="flex items-center gap-2">
                                        <FaCheckCircle />
                                        Complete Deliveries
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/MyEarnings" className="flex items-center gap-2">
                                        <FaCoins />
                                        My-Earnings
                                    </NavLink>
                                </li>
                            </>
                        )
                    }

                    {/* admin */}
                    {
                        User.role === 'admin' && (
                            <>
                                <li>
                                    <NavLink to="/dashboard/AllParcels" className="flex items-center gap-2">
                                        <FaBoxOpen />
                                        All Parcels
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/UserManagement" className="flex items-center gap-2">
                                        <FaUser />
                                        User Management
                                    </NavLink>
                                </li>



                                <li>
                                    <NavLink to="/dashboard/ConfirmRiders" className="flex items-center gap-2">
                                        <FaUserCheck />
                                        Confirm Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/PendingRiders" className="flex items-center gap-2">
                                        <FaUserClock />
                                        Pending Riders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to="/dashboard/ActiveRiders" className="flex items-center gap-2">
                                        <FaUserShield />
                                        Active Riders
                                    </NavLink>
                                </li>
                            </>
                        )
                    }
                </ul>

            </div>
        </div>
    );
};

export default DashboardLayout;