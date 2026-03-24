import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const ConfirmRiders = () => {
    const axiosSecure = useAxiosSecure();
    const modalRef = useRef(null); // Reference for the modal

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filteredRiders, setFilteredRiders] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    // Fetch all orders/payments
    const { data: paymentsData = [], isLoading, refetch } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const res = await axiosSecure.get("/payments");
            return res.data;
        },
    });

    // Fetch all riders
    const { data: riders = [] } = useQuery({
        queryKey: ["riders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders");
            return res.data;
        },
    });

    // Show modal with riders
    const handleSeeRiders = (order) => {
        setSelectedOrder(order);

        // Filter riders in same district
        const matched = riders.filter(
            (rider) =>
                rider.district?.toLowerCase().trim() ===
                order.receiverDistrict?.toLowerCase().trim()
        );

        setFilteredRiders(matched);
        modalRef.current.showModal(); // Open modal
    };

    // Confirm rider
    const handleConfirm = async (order, rider) => {
        setLoading(true);
        try {
            const result = await Swal.fire({
                title: "Confirm Rider?",
                text: `Assign ${rider.name} for this delivery?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#84cc16",
                confirmButtonText: "Yes, Assign",
                target: modalRef.current,
            });

            if (result.isConfirmed) {
                // Update payments
                const updatedData = {
                    riderId: rider._id,
                    riderDistrict: rider.district,
                    riderEmail: rider.email
                }

                await axiosSecure.patch(`/payments/${order._id}`, { deliveryStatus: "confirm", updatedData });

                const res = await axiosSecure.get('/parcels');
                const allParcels = res.data;
                const cParcel = allParcels.find(p => p.trackingId === order.trackingId);

                const updateParcelDelivery = {
                    riderId: rider._id,
                    riderDistrict: rider.district,
                    riderEmail: rider.email
                }

                await axiosSecure.patch(`/parcels/${cParcel._id}`, updateParcelDelivery);

                refetch();

                navigate('/dashboard/payments/track', { state: order.trackingId })

                await Swal.fire({
                    title: "Success!",
                    text: "Rider assigned & tracking updated!",
                    icon: "success",
                    target: modalRef.current,
                });

                modalRef.current.close();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: "Failed to assign rider",
                icon: "error",
                target: modalRef.current,
            });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading orders...</p>;

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentsData.map((order) => (
                    <div key={order._id} className="card bg-base-100 shadow border">
                        <div className="card-body p-4">
                            <h2 className="card-title text-lime-700">{order.title}</h2>

                            <p className="text-sm"><strong>Tracking ID:</strong> {order.trackingId}</p>

                            <div className="text-sm mt-2">
                                <p><strong>Sender:</strong> {order.senderName}</p>
                                <p className="text-xs">{order.senderCenter}, {order.senderDistrict}</p>
                                <p className="text-xs">Contact: {order.senderContact}</p>
                            </div>

                            <div className="text-sm mt-2">
                                <p><strong>Receiver:</strong> {order.receiverName}</p>
                                <p className="text-xs">{order.receiverCenter}, {order.receiverDistrict}</p>
                                <p className="text-xs">Contact: {order.receiverContact}</p>
                            </div>

                            <p className="font-bold text-lime-600 mt-2">৳ {order.amount}</p>

                            <p className="text-sm"><strong>Status:</strong> {order.deliveryStatus}</p>

                            {/* Updated Button */}
                            {order.deliveryStatus === "confirm" ? (
                                <button className="btn btn-sm mt-3 text-red-500 disabled:cursor-none" disabled>
                                    Rider Booked
                                </button>
                            ) : (
                                <button
                                    className="btn btn-sm mt-3 bg-lime-500 text-white"
                                    onClick={() => handleSeeRiders(order)}
                                    disabled={loading}
                                >
                                    See Rider
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <dialog ref={modalRef} className="modal">
                <div className="modal-box max-w-lg">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
                    </form>

                    <h3 className="font-bold text-lg text-lime-700 mb-4">Available Riders</h3>

                    {filteredRiders.length === 0 ? (
                        <p className="text-red-500">No riders found in {selectedOrder?.receiverDistrict}</p>
                    ) : (
                        <div className="space-y-3">
                            {filteredRiders.map((rider) => (
                                <div key={rider._id} className="border p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold uppercase">{rider.name}</p>
                                        <p className="text-xs opacity-60">{rider.email}</p>
                                        <p className="text-xs opacity-60">{rider.warehouse} , {rider.district}</p>
                                    </div>
                                    <button
                                        className="btn btn-xs bg-lime-600 text-white"
                                        onClick={() => handleConfirm(selectedOrder, rider)}
                                        disabled={loading}
                                    >
                                        {loading ? "..." : "Confirm"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default ConfirmRiders;