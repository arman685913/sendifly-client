import React, { useState } from 'react';

const AboutUs = () => {

    const [title, setTitle] = useState('Story')

    const descriptions = [
    {
        id: "story",
        title: "Story",
        description: "SendiFly started with a simple vision — to make parcel delivery easier, faster, and more reliable for everyone. What began as a small initiative to solve everyday delivery challenges has grown into a trusted logistics platform serving individuals and businesses alike. Over the years, we have continuously expanded our operations, integrating advanced technology and building partnerships with local and national courier networks. By combining modern software solutions with efficient delivery networks, we created a system where sending parcels is simple, transparent, and stress-free. Our services include real-time tracking, automated notifications, flexible delivery schedules, and optimized routing for speed and accuracy. Today, SendiFly continues to evolve, not only improving the speed and reliability of deliveries but also innovating new services such as same-day delivery, international shipping support, and personalized logistics solutions. Every package is handled with utmost care, ensuring that our customers experience convenience and peace of mind from the moment they schedule a pickup until the parcel safely reaches its destination."
    },
    {
        id: "mission",
        title: "Mission",
        description: "Our mission is to transform the parcel delivery experience by providing fast, secure, and dependable logistics solutions. We strive to simplify shipping through real-time tracking, optimized delivery routes, and customer-focused services. At SendiFly, we believe every package carries value, trust, and expectation — and we are committed to delivering all three with excellence. Our goal is to empower both individuals and businesses to send parcels without worry, knowing that our technology ensures precision, efficiency, and transparency. We are constantly analyzing delivery patterns and customer feedback to refine our services, reduce delays, and prevent errors. By prioritizing reliability and responsiveness, SendiFly aspires to set a new standard in the logistics industry, providing innovative solutions that meet the evolving needs of a modern world where speed, safety, and service quality are paramount."
    },
    {
        id: "success",
        title: "Success",
        description: "Over the years, SendiFly has successfully delivered thousands of parcels across multiple locations, building strong relationships with both individuals and businesses. Our focus on efficiency, transparency, and reliable service has earned us the trust of our growing community. Every successful delivery represents our commitment to accuracy, punctuality, and customer satisfaction. Beyond just sending packages, we measure success by the long-term partnerships we develop, the positive experiences of our clients, and the continuous improvement of our operations. We have introduced intelligent routing systems, predictive delivery analytics, and customer support frameworks that ensure each parcel is tracked and managed meticulously. With every successful delivery, we strengthen our reputation as a dependable logistics partner, expanding our reach while maintaining the high standards that our customers rely on."
    },
    {
        id: "team",
        title: "Team & Others",
        description: "Behind SendiFly is a passionate team of logistics experts, technology specialists, and customer support professionals dedicated to improving the delivery experience. Our team works tirelessly to ensure that every parcel reaches its destination safely and on time. We value collaboration, innovation, and a customer-first mindset, bringing together experts in route optimization, software development, warehouse management, and client relations. Together, we continuously develop new tools and strategies to make deliveries faster, more accurate, and more convenient. Beyond daily operations, our team invests in training, knowledge sharing, and the adoption of best practices to stay ahead in the logistics industry. From innovating smart tracking solutions to expanding our network, the SendiFly team ensures that every step in the delivery journey is seamless, reinforcing our mission to provide smarter, faster, and more reliable delivery services for all."
    }
];

    const description = descriptions.find(d => d.title === title);

    return (
        <div className='lg:my-10 md:my-8 my-6 flex justify-center items-center'>
            <div className="card card-border bg-base-100 lg:w-10/12 md:w-11/12 mx-2">
                <div className="card-body">
                    <h2 className="text-4xl font-bold mb-2">About Us</h2>
                    <p className='lg:w-1/2 md:w-2/3 mb-4 text-xs px-1 -mt-1.5'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                    <div className="card-actions">
                        {descriptions.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setTitle(section.title)}
                                className={`btn btn-ghost text-lg font-bold ${title === section.title ? 'text-black dark:text-white' : 'text-gray-400'}`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                    <div className='p-2 border rounded-2xl border-gray-300'>
                        {
                            description?.description
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;