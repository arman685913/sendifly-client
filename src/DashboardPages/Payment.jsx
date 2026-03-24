import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router';

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY)

const Payment = () => {

    const { id } = useParams()
    // console.log(id)

    return (
        <div >
            <Elements stripe={stripePromise}>
                <CheckoutForm parcelId={id} />
            </Elements>
        </div>
    );
};

export default Payment;