import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import locationImg from '../../assets/location-merchant.png';
import bgMerchant from '../../assets/bgMerchant.png';

const Merchant = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="relative my-14 w-11/12 max-w-6xl mx-auto rounded-3xl overflow-hidden dark:bg-base-300 bg-teal-900 flex flex-col-reverse md:flex-row items-center md:justify-between">
      
      <img 
        src={bgMerchant} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div 
        data-aos="fade-right" 
        className="relative z-10 p-8 md:p-16 flex-1 text-center md:text-left"
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
          Merchant and Customer Satisfaction is Our First Priority
        </h1>
        <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed text-justify">
          We offer the lowest delivery charge with the highest value along with 100% safety of your product. 
          Pathao courier delivers your parcels in every corner of Bangladesh right on time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button className="btn rounded-2xl bg-lime-300 dark:bg-lime-600 not-dark:hover:bg-white not-dark:text-black px-6 py-2">
            Become a Merchant
          </button>
          <button className="btn btn-outline rounded-2xl border-lime-300 text-lime-300 dark:border-white dark:text-white  not-dark:hover:bg-lime-300 not-dark:hover:text-black px-6 py-2">
            Earn with Sendifly Courier
          </button>
        </div>
      </div>

      <div 
        data-aos="fade-left"
        className="relative z-10 flex-1 mt-8 md:mt-0 flex justify-center md:justify-end"
      >
        <img src={locationImg} alt="Location" className="w-3/4 md:w-full max-w-sm" />
      </div>

    </div>
  );
};

export default Merchant;