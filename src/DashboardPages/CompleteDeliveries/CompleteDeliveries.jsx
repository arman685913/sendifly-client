import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const CompleteDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [cashOutStatus, setCashOutStatus] = useState({});

  // Payments
  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await axiosSecure.get("/payments")).data,
  });

  // Tracking info
  const { data: tracks = [] } = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => (await axiosSecure.get("/tracking")).data,
  });

  // Rider Cashouts
  const { data: cashoutsData = [] } = useQuery({
    queryKey: ["cashoutsData"],
    queryFn: async () =>
      (
        await axiosSecure.get(`/rider/cashout?riderEmail=${user?.email}`)
      ).data.cashouts || [],
  });


  // Filter my parcels
  const myParcels = payments
    .filter((p) => p.riderEmail === user?.email)
    .map((order) => {
      const track = tracks.find((t) => t.trackingId === order.trackingId);
      const status = track?.deliveryStatus?.toLowerCase() || "pending";
      let income = 0;
      
      if (status === "confirmed" || status === "delivered") {
        income = (order.amount || 0) * 0.7; // 70% income
      }
      return { ...order, status, income };
    })
    .filter((o) => o.status === "confirmed" || o.status === "delivered");

  const handleParcelCashOut = async (order) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Cash Out",
        text: `Do you want to cash out $${order.income.toFixed(2)}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Cash Out",
      });

      if (!result.isConfirmed) return;

      const riderSummary = {
        trackingId: order.trackingId,
        riderEmail: order.riderEmail,
        income: order.income,
        cashoutStatus: "Cashouted",
        cashoutTime: new Date().toLocaleString(),
      };

      await axiosSecure.post("/rider/cashout", { riderSummary });

      setCashOutStatus((prev) => ({ ...prev, [order.trackingId]: true }));

      // Refresh queries
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["tracking"]);
      queryClient.invalidateQueries(["cashoutsData"]);

      toast.success(`Cash Out successful: $${order.income.toFixed(2)}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Cash Out failed! Try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Deliveries</h2>

      

      {myParcels.length === 0 ? (
        <p className="mx-3 my-5 text-center p-14 border-2 border-dashed border-lime-300 rounded-2xl">No deliveries yet</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myParcels.map((order) => {
            const cashoutData = cashoutsData.find(
              (c) => c.trackingId === order.trackingId
            );
            const isCashouted =
              cashoutData?.cashoutStatus === "Cashouted" ||
              cashOutStatus[order.trackingId];


            return (
              <div
                key={order._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold">{order.title}</h3>

                <p className="mt-1 text-gray-700">
                  Cashout Status: {isCashouted ? "Cashouted" : "Pending"}
                </p>

                <p className="mt-2 text-sm ">
                  Tracking ID: {order.trackingId}
                </p>
                <p className="mt-2 text-sm ">
                  Amount: ${order.amount?.toFixed(2) || 0}
                </p>
                <p className="mt-1 text-sm font-medium text-purple-700">
                  Your Income: ${order.income.toFixed(2)}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Cashout Date: {cashoutData?.cashoutTime || "N/A"}
                </p>

                { 
                  order.status === 'delivered' ? 
                <button
                  disabled={(isCashouted)}
                  onClick={() => handleParcelCashOut(order)}
                  className={`mt-3 px-3 py-1 rounded text-white font-medium transition ${isCashouted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  Cash Out
                </button> :
                <button
                  className={`mt-3 px-3 py-1 rounded text-white font-medium transition bg-gray-400 cursor-not-allowed
                    }`}
                >
                  parcel on the way
                </button>
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompleteDeliveries;