import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Hooks/Loader";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaDeleteLeft } from "react-icons/fa6";
import { Trash2 } from "lucide-react";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedRider, setSelectedRider] = useState(null);

    // Fetch active riders
    const { isLoading, data: riders = [], refetch } = useQuery({
        queryKey: ["active-riders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders");
            return res.data.filter((rider) => rider.status === "Accepted");
        },
    });

    const updateStatus = async (id, email, newStatus) => {
        try {
            if (newStatus === "inactive") {
                await axiosSecure.patch(`/riders/${id}`, { status: "pending", email });
                Swal.fire("Success!", "Rider moved to pending.", "success");
                refetch();
            } else if (newStatus === "delete") {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "This rider will be deleted from the database!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                });
                if (result.isConfirmed) {
                    await axiosSecure.delete(`/riders/${id}`);
                    Swal.fire("Deleted!", "Rider has been removed.", "success");
                    refetch();
                }
            }
        } catch (error) {
            Swal.fire("Error!", "Operation failed!", "error");
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="p-4 bg-base-300">
            <h2 className="text-2xl font-bold mb-4">Active Riders</h2>
            {riders.length === 0 ? (
                <div className="mx-3 my-5 text-center p-14 border-2 border-dashed border-lime-300 rounded-2xl">
                    No Active Riders Found.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {riders.map((rider) => (
                        <div
                            key={rider._id}
                            className="bg-white  dark:bg-gray-800 shadow-md rounded-xl p-5 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-2">{rider.name}</h3>
                                <p><strong>Region:</strong> {rider.region}</p>
                                <p><strong>District:</strong> {rider.district}</p>
                                <p className="mt-2 px-2 py-1 text-sm inline-block bg-green-100 text-green-800 rounded-3xl">
                                    Active
                                </p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex-1"
                                    onClick={() => setSelectedRider(rider)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded flex-1"
                                    onClick={() => updateStatus(rider._id, rider.email, "inactive")}
                                >
                                    Deactivate
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 flex justify-center items-center rounded flex-1"
                                    onClick={() => updateStatus(rider._id, rider.email, "delete")}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Rider Details */}
            {selectedRider && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => setSelectedRider(null)}
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Name : {selectedRider.name}</h3>
                        <div className="flex md:flex-row flex-col-reverse justify-center items-center">
                            <div className="space-y-2">
                                <p><strong>Age:</strong> {selectedRider.age}</p>
                                <p><strong>Email:</strong> {selectedRider.email}</p>
                                <p><strong>Contact:</strong> {selectedRider.contact}</p>
                                <p><strong>Bike Name:</strong> {selectedRider.bikeName}</p>
                                <p><strong>Bike Reg:</strong> {selectedRider.bikeReg}</p>
                                <p><strong>NID:</strong> {selectedRider.nid}</p>
                                <p><strong>Region:</strong> {selectedRider.region}</p>
                                <p><strong>District:</strong> {selectedRider.district}</p>
                                <p><strong>Warehouse:</strong> {selectedRider.warehouse}</p>
                                <p><strong>Status:</strong> Active</p>
                                <p><strong>Created At:</strong> {selectedRider.created_at}</p>
                            </div>
                            <div className="p-2 m-2 border border-gray-300">
                                <img className="w-40 h-52" src={selectedRider.img} alt="IMG" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;