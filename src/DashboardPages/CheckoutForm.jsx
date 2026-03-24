import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useTracking from '../Hooks/useTracking';

const CheckoutForm = ({ parcelId }) => {

    const { updateTrackingUpdate } = useTracking();

    const axiosSecure = useAxiosSecure();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Get parcel info
    const { data: parcel = {}, refetch } = useQuery({
        queryKey: ['parcel', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    const price = parcel.deliveryCost || 0;
    const amountInCents = price * 100;

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        // Step 1: Card Validate
        const { error: pmError } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (pmError) {
            console.log('[PaymentMethod error]', pmError);
            setError(pmError.message);
            return;
        }

        try {

            // Step 2: Create PaymentIntent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId
            });

            const clientSecret = res.data.clientSecret;

            // Step 3: Confirm Payment
            const { paymentIntent, error: confirmError } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: user.displayName,
                            email: user.email
                        }
                    }
                });

            if (confirmError) {
                console.log('Payment failed', confirmError);
                setError(confirmError.message);
                return;
            }

            // Payment success
            console.log('Payment successful', paymentIntent);

            setSuccess('Payment successful!');
            setError('');
            toast.success('Payment successful!');

            const updateParcelDelivery = {
                paymentStatus: 'paid', deliveryStatus: 'pending',
                deliveryTime: "not-delivered",
            }

            // Update parcel payment status
            await axiosSecure.patch(`/parcels/${parcelId}` , updateParcelDelivery);

            // update tracking status
            const trackingData = {
                deliveryStatus: 'loading',
                note: "Processing",
                paymentDate: new Date().toLocaleString()
            };

            await updateTrackingUpdate(parcel.trackingId, trackingData);
            // console.log(parcel)
            // Save payment history
            await axiosSecure.post('/payments', {
                title: parcel.title,
                senderDistrict: parcel.senderDistrict,
                senderCenter: parcel.senderCenter,
                senderName: parcel.senderName,
                senderContact: parcel.senderContact,
                receiverDistrict: parcel.receiverDistrict,
                receiverCenter: parcel.receiverCenter,
                receiverName: parcel.receiverName,
                receiverContact: parcel.receiverContact,
                email: user.email,
                parcelId: parcelId,
                amount: price,
                trackingId: parcel.trackingId,
                transactionId: paymentIntent.id,
                method: paymentIntent.payment_method_types[0],
                paymentDate: new Date().toLocaleString(),
                deliveryStatus: 'pending',
            });

            refetch();

            navigate('/dashboard/myParcels');

        } catch (err) {
            console.error(err);
            setError('Payment failed. Try again.');
        }
    };

    return (
        <div className='my-40 md:my-20 mx-2'>
            <form
                onSubmit={handlePayment}
                className='space-y-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md max-w-md mx-auto text-gray-800 dark:text-gray-200'
            >
                <CardElement
                    className='p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                />

                <div className='flex flex-col md:flex-row justify-center items-center gap-3 mt-4'>

                    <button
                        className='flex-1 btn btn-primary bg-green-500 dark:bg-green-600 w-full'
                        disabled={!stripe}
                        type="submit"
                    >
                        Pay {price} ৳
                    </button>

                    <Link
                        className='flex-1 btn btn-primary w-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800 text-center py-2 rounded-xl'
                        to='/dashboard/myParcels'
                    >
                        Go Back
                    </Link>

                </div>

                {error && <p className='text-red-500 mt-2'>{error}</p>}
                {success && <p className='text-green-500 mt-2'>{success}</p>}
            </form>
        </div>
    );
};

export default CheckoutForm;