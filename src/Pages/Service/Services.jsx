import React, { useState, useEffect } from "react";
import { PiTargetFill } from "react-icons/pi";

const Services = () => {

  const servicesData = [
    { title: "Express & Standard Delivery", description: "We deliver parcels within 24–72 hours." },
    { title: "Nationwide Delivery", description: "We deliver parcels nationwide." },
    { title: "Fulfillment Solution", description: "Inventory management and order processing." },
    { title: "Cash on Home Delivery", description: "100% cash on delivery anywhere in Bangladesh." },
    { title: "Corporate Service", description: "Corporate logistics and warehouse support." },
    { title: "Parcel Return", description: "Customers can return or exchange products." },
  ];

  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const visibleServices =
    isMobile && !showAll ? servicesData.slice(0, 2) : servicesData;

  return (
    <div className="bg-emerald-950 p-16 text-center rounded-2xl">

      <h1 className="text-white text-3xl font-bold">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">

        {visibleServices.map((service, index) => (
          <div
            key={index}
            className="bg-base-200 hover:bg-lime-300 shadow-md p-6 rounded-2xl"
          >
            <div className="flex justify-center">
              <PiTargetFill
                className="rounded-full bg-blue-100 p-2"
                color="red"
                size={52}
              />
            </div>

            <h1 className="font-bold py-2">{service.title}</h1>
            <p className="text-sm">{service.description}</p>

          </div>
        ))}

      </div>

      {/* Mobile Buttons */}
      {isMobile && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 bg-lime-400 dark:bg-lime-800 px-6 py-2 rounded-full font-semibold"
        >
          See More
        </button>
      )}

      {isMobile && showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-6 dark:bg-lime-800 bg-lime-400 px-6 py-2 rounded-full font-semibold"
        >
          See Less
        </button>
      )}

    </div>
  );
};

export default Services;