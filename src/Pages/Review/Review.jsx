import React, { useRef } from "react";
import victor from "../../assets/Vector@2x.png";
import reviewQuote from "../../assets/reviewQuote.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const Review = () => {

    const swiperRef = useRef(null);

    const authors = [
        {
            id: 1,
            author: "John Smith",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            author_position: "CEO, Tech Solutions",
            review: "Excellent service and very fast delivery. I am really satisfied with the overall experience."
        },
        {
            id: 2,
            author: "Sarah Johnson",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            author_position: "Marketing Manager",
            review: "Professional team and great customer support. Highly recommended."
        },
        {
            id: 3,
            author: "Michael Brown",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            author_position: "Founder, Startup Hub",
            review: "Their service quality is outstanding. Everything was handled smoothly."
        },
        {
            id: 4,
            author: "Emily Davis",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            author_position: "Product Designer",
            review: "Very reliable service. I received my package earlier than expected."
        },
        {
            id: 5,
            author: "David Wilson",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            author_position: "E-commerce Seller",
            review: "Perfect delivery system for my online business. Saves me a lot of time."
        },
        {
            id: 6,
            author: "Olivia Taylor",
            author_img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
            author_position: "Freelancer",
            review: "Great experience working with them. The process was very simple and quick."
        }
    ];

    return (
        <section className="py-16 px-6 text-center">

            {/* Header */}
            <div className="max-w-3xl mx-auto mb-12">
                <div className="flex justify-center">
                    <img className="w-40 mb-4" src={victor} alt="Vector" />
                </div>

                <h2 className="text-4xl font-bold mb-4">
                    What Our Customers Are Saying
                </h2>

                <p className="text-gray-500 text-justify">
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and
                    strengthen your body with ease!
                </p>
            </div>


            <div className="relative max-w-7xl mx-auto ">

                {/* Left Arrow */}
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-30 md:left-10  -bottom-12 z-10 bg-lime-400 p-2 dark:bg-lime-600 rounded-full shadow hover:bg-gray-100"
                >
                    <FaArrowCircleLeft className="dark:text-black" size={20} />
                </button> 

                {/* Right Arrow */}
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-30 md:right-10 -bottom-12 z-10 bg-lime-400 p-2 dark:bg-lime-600 rounded-full shadow hover:bg-gray-100"
                >
                    <FaArrowCircleRight className="dark:text-black" size={20} />
                </button>


                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={1}
                    spaceBetween={20}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 1.5,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    modules={[Pagination, Autoplay]}
                    className="reviewSwiper "
                >

                    {authors.map((author) => (

                        <SwiperSlide key={author.id}>

                            <div className="bg-base-100 p-6 rounded-2xl shadow-xl  transition-all duration-500 ">

                                {/* Review */}
                                <div className="border-b border-dashed pb-5 mb-5">
                                    <img
                                        src={reviewQuote}
                                        alt="quote"
                                        className="w-8 mb-3 opacity-70"
                                    />

                                    <p className="text-gray-600 text-sm leading-relaxed dark:text-white">
                                        {author.review}
                                    </p>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-4">

                                    <img
                                        className="w-12 h-12 rounded-full border"
                                        src={author.author_img}
                                        alt={author.author}
                                    />

                                    <div className="text-left">
                                        <h4 className="font-semibold">
                                            {author.author}
                                        </h4>

                                        <p className="text-sm text-gray-500">
                                            {author.author_position}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </SwiperSlide>

                    ))}

                </Swiper>

            </div>

        </section>
    );
};

export default Review;