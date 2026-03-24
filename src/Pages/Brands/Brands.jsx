import React from 'react';
import casio from '../../assets/brands/casio.png'
import amazon from '../../assets/brands/amazon.png'
import moonstar from '../../assets/brands/moonstar.png'
import start from '../../assets/brands/start.png'
import people from '../../assets/brands/start-people.png'
import randstad from '../../assets/brands/randstad.png'
import Marquee from "react-fast-marquee";

const Brands = () => {

    const brands = [
        { id: 1, img: casio, name: "Casio" },
        { id: 2, img: amazon, name: "Amazon" },
        { id: 3, img: moonstar, name: "Moonstar" },
        { id: 4, img: start, name: "Start" },
        { id: 5, img: people, name: "Start People" },
        { id: 6, img: randstad, name: "Randstad" },
    ]

    return (
        <section className='py-16 border-b border-dashed mb-12 border-gray-500 dark:bg-white/30 lg:w-11/12 mx-auto '>
            <div className='max-w-7xl mx-auto px-4 text-center'>

                <h2 className='text-3xl font-bold mb-10'>
                    We've helped thousands of sales teams
                </h2>

                <Marquee pauseOnHover={true}>
                    <div className='grid grid-cols-6 gap-8 items-center justify-items-center'>
                        {
                            brands.map(brand => (

                                <img
                                    key={brand.id}
                                    src={brand.img}
                                    alt={brand.name}
                                    className='hover:grayscale transition duration-300 h-4'
                                />
                            ))
                        }
                    </div>
                </Marquee>

            </div>
        </section>
    );
};

export default Brands;