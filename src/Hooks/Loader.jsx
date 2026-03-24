import React from 'react';

const Loader = () => {
    return (
        <div className='flex min-h-72 justify-center items-center gap-2'>
            <span className="loading loading-dots loading-xs"></span>
            <span className="loading loading-dots loading-xs"></span>
            <span className="loading loading-dots loading-xs"></span>
            <span className="loading loading-dots loading-xs"></span>
        </div>
    );
};

export default Loader;