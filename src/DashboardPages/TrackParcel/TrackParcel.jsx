import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import {
  FaSearch,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";
import Loader from "../../Hooks/Loader";
import { useLocation } from "react-router";

const TrackParcel = () => {
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [trackingId, setTrackingId] = useState(location.state || "");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get("/user");
        const currentUser = res.data.find((u) => u.email === user?.email);
        setIsAdmin(currentUser?.role === "admin");
      } catch (error) {
        console.error(error);
      }
    };
    fetchRole();
  }, [user?.email]);

  // Fetch parcels
  const { data: allTracking = [], isLoading, refetch } = useQuery({
    queryKey: ["allTracking"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tracking");
      return res.data;
    },
  });

  // Filter parcels
  const filteredTracking = trackingId.trim()
    ? allTracking.filter(
      (parcel) =>
        (isAdmin || parcel.email === user?.email) &&
        parcel.trackingId
          .toLowerCase()
          .includes(trackingId.trim().toLowerCase())
    )
    : allTracking.filter((parcel) => isAdmin || parcel.email === user?.email);

  // Update Warehouse status
  const handleUpdateStatus = async (parcel) => {
    try {
      await axiosSecure.patch(`/tracking/${parcel.trackingId}`, {
        note: "Ready for Delivered",
        arrivedAtWarehouseTime: new Date().toISOString(),
      });

      // Refetch parcels
      refetch();
    } catch (error) {
      console.error("Warehouse status update error:", error);
    }
  };

  // Update Delivered status
  const handleDeliveryStatus = async (trackingId) => {
    try {

      const res = await axiosSecure.get('/parcels');
      const allParcels = res.data;
      const parcel = allParcels.find(p => p.trackingId === trackingId);

      await axiosSecure.patch(`/tracking/${trackingId}`, {
        note: "Delivered Successfully",
        deliveryTime: new Date().toISOString(),
        deliveryStatus: "Delivered",
      });


      const updateParcelDelivery = {
        deliveryStatus: 'delivered',
        deliveryTime: new Date().toISOString(),
      }

      await axiosSecure.patch(`/parcels/${parcel._id}`, updateParcelDelivery);
      // Refetch parcels
      refetch();
    } catch (error) {
      console.error("Delivery status update error:", error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4">
      <div className="bg-white dark:bg-gray-800 max-w-6xl mx-auto rounded-xl shadow p-10 text-gray-800 dark:text-gray-200">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2">
          Track Your Consignment
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your tracking code to see parcel progress
        </p>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full md:w-2/3">
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Tracking Code"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700"
            />
          </div>
        </div>

        {isLoading && <Loader />}

        {/* Parcels */}
        {filteredTracking.map((parcel) => {
          const showWarehouseButton =
            isAdmin && parcel.note === "Arrived at The warehouse";
          const showDeliveredButton =
            isAdmin && parcel.note !== "Delivered Successfully";

          return (
            <div
              key={parcel.trackingId}
              className="grid md:grid-cols-2 gap-6 mb-10 border rounded-xl p-6"
            >
              {/* LEFT: Parcel Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Parcel Information</h2>
                <p>
                  <strong>Tracking ID:</strong> {parcel.trackingId}
                </p>
                <p>
                  <strong>Order Date:</strong> {parcel.orderDate}
                </p>
                <p>
                  <strong>Payment Date:</strong> {parcel.paymentDate || "Not Paid"}
                </p>
                <p>
                  <strong>Note:</strong> {parcel.note || "Processing"}
                </p>

                {/* Route */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Shipment Route</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div>
                      <p className="font-medium">{parcel.locationSenderDistrict}</p>
                      <p className="text-gray-500">{parcel.locationSenderCenter}</p>
                    </div>

                    <FaArrowRight />

                    <div>
                      <p className="font-medium">{parcel.locationReceiverDistrict}</p>
                      <p className="text-gray-500">{parcel.locationReceiverCenter}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Tracking Timeline */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Tracking Updates</h2>
                <div className="border-l pl-6 space-y-6">
                  {/* Parcel Created */}
                  <div className="relative">
                    <span className="absolute -left-10 bg-blue-500 text-white p-2 rounded-full">
                      <FaBoxOpen />
                    </span>
                    <p className="font-medium">Parcel Created</p>
                    <p className="text-sm">{parcel.orderDate}</p>
                  </div>

                  {/* Processing */}
                  <div className="relative">
                    <span className="absolute -left-10 bg-orange-500 text-white p-2 rounded-full">
                      <FaTruck />
                    </span>
                    <p className="font-medium">Processing at Origin</p>
                    <p className="text-sm">{parcel.paymentDate}</p>
                  </div>

                  {/* Warehouse */}
                  <div className="relative">
                    <span className="absolute -left-10 bg-purple-500 text-white p-2 rounded-full">
                      <FaMapMarkerAlt />
                    </span>
                    <p className="font-medium">Arrived at Warehouse</p>
                    <p className="text-sm">{parcel.arrivedAtWarehouseTime}</p>
                  </div>

                  {/* Delivered */}
                  {parcel.note === "Delivered Successfully" && (
                    <div className="relative">
                      <span className="absolute -left-10 bottom-0 bg-green-500 text-white p-2 rounded-full">
                        <FaCheckCircle />
                      </span>
                      <p className="font-medium">{parcel.deliveryStatus}</p>
                      <p className="text-sm">{parcel.deliveryTime}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: Buttons */}
              <div className="md:col-span-2 flex justify-center gap-4 mt-6">
                {showWarehouseButton && (
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                    onClick={() => handleUpdateStatus(parcel)}
                  >
                    Mark Arrived at Warehouse
                  </button>
                )}
                {(showDeliveredButton && parcel.note == "Ready for Delivered") && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleDeliveryStatus(parcel.trackingId)}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackParcel;