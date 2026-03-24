import React from 'react';
import { LuTruck } from 'react-icons/lu';

const Works = () => {
    return (
        <div className='mx-12 mb-12'>
            <h1 className='text-3xl font-bold my-7 '>How It Works</h1>
            <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2  gap-4'>
                <div data-aos="flip-down" className='bg-base-200 border border-gray-400 shadow-md p-4 rounded-2xl'>
                    <LuTruck size={36} />
                    <h1 className='font-bold py-2'>
                        Booking Pick & Drop
                    </h1>
                    <p className='text-sm'>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div data-aos="flip-left" className='bg-base-200 border border-gray-400 shadow-md p-4 rounded-2xl'>
                    <LuTruck size={36} />
                    <h1 className='font-bold py-2'>
                        Cash On Delivery
                    </h1>
                    <p className='text-sm'>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div data-aos="flip-right" className='bg-base-200 border border-gray-400 shadow-md p-4 rounded-2xl'>
                    <LuTruck size={36} />
                    <h1 className='font-bold py-2'>
                        Delivery Hub
                    </h1>
                    <p className='text-sm'>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div data-aos="flip-up" className='bg-base-200 border border-gray-400 shadow-md p-4 rounded-2xl'>
                    <LuTruck size={36} />
                    <h1 className='font-bold py-2'>
                        Booking SME & Corporate
                    </h1>
                    <p className='text-sm'>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
            </div>
        </div>
    );
};

export default Works;