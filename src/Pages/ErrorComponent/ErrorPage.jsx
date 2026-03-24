import React from 'react';
import errorImg from '../../assets/Error/error.png';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
            <div className="text-center max-w-lg">
                {/* Visual Section */}
                <div className=" transform hover:scale-105 transition-transform duration-300">
                    <img 
                        src={errorImg} 
                        alt="Illustration of a lost traveler" 
                        className="mx-auto max-w-40 max-h-48 drop-shadow-xl"
                    />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    Whoops! You're lost in space.
                </h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    The page you are looking for doesn't exist or has been moved. 
                    Don't worry, even the best explorers lose their way sometimes.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="px-5 py-2 bg-lime-700 text-white font-semibold rounded-2xl shadow-lg hover:bg-lime-800 hover:shadow-lime-200/50 transition-all duration-200"
                    >
                        Return Home
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()}
                        className="px-5 py-2 border-2 border-lime-700 text-lime-700 font-semibold rounded-2xl hover:bg-lime-50 transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;