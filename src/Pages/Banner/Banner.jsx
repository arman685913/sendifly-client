import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "../../assets/banner/banner1.png"
import banner2 from "../../assets/banner/banner2.png"
import banner3 from "../../assets/banner/banner3.png"

const Banner = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-xl shadow-md">
            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} className="relative z-0">
                <div className="relative">
                    <img src={banner1} className="w-full object-cover rounded-xl" />
                    
                    <div className="absolute inset-0 dark:bg-black/20 rounded-xl pointer-events-none"></div>
                </div>
                <div className="relative">
                    <img src={banner2} className="w-full object-cover rounded-xl" />
                    <div className="absolute inset-0 dark:bg-black/20 rounded-xl pointer-events-none"></div>
                </div>
                <div className="relative">
                    <img src={banner3} className="w-full object-cover rounded-xl" />
                    <div className="absolute inset-0 dark:bg-black/20 rounded-xl pointer-events-none"></div>
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;