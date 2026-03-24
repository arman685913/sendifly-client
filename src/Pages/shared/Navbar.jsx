import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../../assets/Logo.png'
import { RiMenu2Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { BsArrowUpRightCircleFill } from 'react-icons/bs';
import useAuth from '../../Hooks/useAuth';
import { toast } from 'react-toastify';
import ToggleTheme from '../ToggleTheme/ToggleTheme'

const Navbar = () => {

    const { user, logOut } = useAuth();

    const handleLogout = () => {
        logOut()
        toast.info("Logout Successfully")
    }

    const navItems = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/pricing">Send-Parcel</NavLink></li>
        <li><NavLink to="/coverage">Coverage</NavLink></li>
        {
            user &&
            <>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            </>
        }
        <li><NavLink to="/about">About Us</NavLink></li>
        <li><NavLink to="/rider">Be A Rider</NavLink></li>

    </>

    const [dropdown, setDropdown] = useState(true)

    return (
        <div className="navbar bg-base-100 shadow-sm mb-3 rounded-2xl ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div >
                        <button className=" p-2 hover:cursor-pointer lg:hidden" onClick={() => setDropdown(!dropdown)}>
                            {
                                dropdown ? <RiMenu2Line size="20" /> : <RxCross2 size="20" />
                            }
                        </button>

                    </div>
                    {
                        !dropdown &&
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border">
                            {
                                navItems
                            }
                        </ul>
                    }
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <div>
                        <Link to='/'><img src={logo} className='w-30 lg:w-36' alt="Sendifly" /></Link>
                    </div>
                    <div >
                        <ToggleTheme ></ToggleTheme>
                    </div>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal text-lg">
                    {
                        navItems
                    }
                </ul>
            </div>
            <div className="navbar-end lg:gap-2 gap-1.5">
                {
                    user ? <button onClick={() => handleLogout()} className="btn btn-sm lg:btn-md rounded-lg btn-outline border-gray-300 bg-lime-400 dark:bg-lime-700">Sign Out</button> :
                        <Link to="/login" className="btn btn-sm lg:btn-md rounded-lg btn-outline ">Sign In</Link>
                }
                {
                    !user &&
                    <Link to="/register" className="btn lg:btn-md btn-sm rounded-lg dark:bg-lime-700 bg-lime-400 ">Sign Up</Link>
                }
                <Link className="dark:text-lime-400">
                    <BsArrowUpRightCircleFill
                        className="w-6 h-6 lg:w-8 lg:h-8"
                    />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;