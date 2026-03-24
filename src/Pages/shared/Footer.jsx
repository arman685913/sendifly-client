import React from 'react';
import logo from '../../assets/Logo.png'
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { FaInstagram, FaYoutube } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-lime-200 dark:bg-lime-950 md:p-10 p-6">
            <aside>
                <img src={logo} className='w-[150px]' alt="" />
                <p className='font-bold text-xl'>Fast Delivery, Smart Way</p>
                <p className='md:w-10/12 text-justify'>Sendifly is a modern courier and    parcel delivery service app that ensures fast and secure shipping from one place to another.
                It offers easy tracking, quick delivery, and reliable logistics to make sending parcels simple and efficient.
                </p>
            </aside>
            <nav>
                <div className="grid -my-5 grid-flow-col gap-8
                5 md:gap-12 lg:gap-16 border border-gray-400 py-3 px-6 md:px-8 lg:px-12 rounded-3xl">
                    <a target='_blank' href='https://www.facebook.com/'>
                        <FaFacebookF color='blue' size={18}></FaFacebookF>
                    </a>
                    <a target='_blank' href='https://x.com/'>
                        <FaXTwitter size={18} />
                    </a>

                    <a target='_blank' href='https://www.instagram.com/?hl=en'>
                        <FaInstagram color='pink' className='bg-rose-700' size={20} />
                    </a>
                    <a target='_blank' href='https://www.youtube.com/'>
                        <FaYoutube color='red' size={20}></FaYoutube>
                    </a>
                </div>
            </nav>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </footer>
    );
};

export default Footer;