import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { Link } from "react-router";

const FAQ = () => {
  return (
    <div className="w-10/12 mx-auto py-16">

      <h2 className="text-3xl font-bold text-center mb-4">
        Frequently Asked Question (FAQ)
      </h2>

      <p className="text-center text-gray-500 mb-10">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with ease!
      </p>

      <div className="space-y-4 ">

        <div data-aos="flip-left" className="collapse collapse-plus bg-base-100 border border-base-300 hover:bg-blue-50  hover:border-blue-400 dark:hover:text-black">
          <input type="radio" name="faq-accordion" defaultChecked />
          <div className="collapse-title font-semibold">
            How does this posture corrector work?
          </div>
          <div className="collapse-content text-sm">
            A posture corrector works by providing support and gentle alignment
            to your shoulders, back, and spine, encouraging you to maintain
            proper posture throughout the day.
          </div>
        </div>

        <div data-aos="flip-right" className="collapse collapse-plus bg-base-100 border border-base-300 dark:hover:text-black hover:bg-blue-50 hover:border-blue-400">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            Is it suitable for all ages and body types?
          </div>
          <div className="collapse-content text-sm">
            Yes, most posture correctors are adjustable and designed to fit
            different body types and ages comfortably.
          </div>
        </div>

        <div data-aos="flip-left" className="collapse dark:hover:text-black collapse-plus bg-base-100 border border-base-300 hover:bg-blue-50 hover:border-blue-400">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            Does it really help with back pain and posture improvement?
          </div>
          <div className="collapse-content text-sm text-justify">
            Yes, regular use can help reduce back pain and gradually improve
            posture by keeping your spine aligned.
          </div>
        </div>

        <div data-aos="flip-right" className="collapse dark:hover:text-black collapse-plus bg-base-100 border border-base-300 hover:bg-blue-50 hover:border-blue-400">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            Does it have smart features like vibration alerts?
          </div>
          <div className="collapse-content text-sm">
            Some modern posture correctors include vibration alerts to remind
            you when your posture becomes incorrect.
          </div>
        </div>

      </div>

      <div className="text-center mt-10">
        <button className="btn bg-lime-400 dark:bg-lime-700 border-none rounded-full">
          See More FAQ's <Link ><BsArrowUpRightCircleFill className="dark:text-black" size="28"/></Link>
        </button>
      </div>

    </div>
  );
};

export default FAQ;