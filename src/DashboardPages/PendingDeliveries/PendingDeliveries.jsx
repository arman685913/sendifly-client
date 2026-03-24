import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch payments
  const { data: payments = [], refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  //  Fetch tracking list
  const { data: tracks = [], refetch: refetchTracking } = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tracking");
      return res.data;
    },
  });

  // Fetch riders
  const { data: riders = [] } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders");
      return res.data;
    },
  });

  //  Filter my parcels
  const myParcels = payments
    .filter((p) => p.riderEmail === user?.email)
    .map((parcel) => {
      const rider = riders.find((r) => r.email === parcel.riderEmail);
      return { ...parcel, rider };
    });

  // Update tracking
  const handleUpdateTracking = async (order) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Update tracking status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/tracking/${order.trackingId}`, {
          deliveryStatus: "confirmed",
          note: "Arrived at The warehouse",
        });

        Swal.fire("Updated!", "Tracking updated successfully", "success");

        refetch();
        refetchTracking();
      } catch (error) {
        Swal.fire("Error!", "Something went wrong", "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Assigned Parcels</h2>

      {myParcels.length == 0 && <p  className="mx-3 my-5 text-center p-14 border-2 border-dashed border-lime-300 rounded-2xl">
        No Deliveries yet</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myParcels.map((order) => {
          const track = tracks.find(
            (t) => t.trackingId === order.trackingId
          );

          return (
            <div key={order._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{order.title}</h3>

              {/*  tracking status */}
              <p>Status: {track?.deliveryStatus || "pending"}</p>

              <p>Customer: {order.email}</p>

              <p className="mt-2 text-sm text-gray-600">
                Rider: {order.riderEmail || "Not Assigned"}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Tracking ID: {order.trackingId || "Not Assigned"}
              </p>

              {/* button */}

              {(track?.deliveryStatus === "confirmed" || track?.deliveryStatus === "Delivered") ?
                <button className="mt-3 px-3 py-1 rounded text-white bg-gray-400 cursor-not-allowed">
                  Updated
                </button> :
                <button className="mt-3 px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                  onClick={() => handleUpdateTracking(order)}>
                  Update Tracking
                </button>

              }

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingDeliveries;