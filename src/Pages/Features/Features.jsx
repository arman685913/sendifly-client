import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import liveTracking from '../../assets/live-tracking.png';
import deliveryman from '../../assets/deliveryman.png';
import safeDel from '../../assets/safeDel.png';

const Features = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const featuresData = [
    {
      img: liveTracking,
      title: "Live Parcel Tracking",
      desc: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      animation: "fade-up"
    },
    {
      img: deliveryman,
      title: "100% Safe Delivery",
      desc: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      animation: "fade-up"
    },
    {
      img: safeDel,
      title: "24/7 Call Center Support",
      desc: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      animation: "fade-up"
    }
  ];

  return (
    <div className='w-11/12 mx-auto flex flex-col gap-5'>
      {featuresData.map((feature, index) => (
        <div data-aos="zoom-in-up"
        key={index}
          className='rounded-2xl p-3 bg-base-100 flex justify-center items-center flex-col md:flex-row shadow-xl'
        >
          <div className='md:border-r dark:bg-white/45 border-b md:border-b-0 p-4 border-dashed'>
            <img src={feature.img} alt={feature.title} />
          </div>
          <div className='p-4'>
            <h3 className='text-xl font-bold'>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;