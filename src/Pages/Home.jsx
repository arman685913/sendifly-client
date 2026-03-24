import React from 'react';
import Banner from './Banner/Banner';
import Works from './Works/Works';
import Services from './Service/Services';
import Brands from './Brands/Brands';
import Features from './Features/Features';
import Merchant from './Merchant/Merchant';
import FAQ from './Faq/Faq';
import Review from './Review/Review';
import AuthLayout from '../Layouts/AuthLayout';

const Home = () => {
    return (
        <div >
            <Banner></Banner>
            <Works></Works>
            <Services></Services>
            <Brands></Brands>
            <Features></Features>
            <Merchant></Merchant>
            <Review></Review>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;