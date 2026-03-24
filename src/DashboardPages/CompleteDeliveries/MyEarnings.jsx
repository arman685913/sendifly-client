import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [cashOutStatus, setCashOutStatus] = useState({});

  // Fetch payments
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => (await axiosSecure.get(`/payments?riderEmail=${user?.email}`)).data,
  });

  // Fetch tracking info
  const { data: tracks = [] } = useQuery({
    queryKey: ["tracking"],
    queryFn: async () => (await axiosSecure.get("/tracking")).data,
  });

  // Fetch cashouts
  const { data: cashoutsData = [] } = useQuery({
    queryKey: ["cashoutsData", user?.email],
    queryFn: async () =>
      (await axiosSecure.get(`/rider/cashout?riderEmail=${user?.email}`)).data.cashouts || [],
  });

  // Filter delivered/confirmed parcels
  const myParcels = payments
    .filter((p) => p.riderEmail === user?.email)
    .map((order) => {
      const track = tracks.find((t) => t.trackingId === order.trackingId);
      const status = track?.deliveryStatus?.toLowerCase() || "pending";
      const income = status === "confirmed" || status === "delivered" ? (order.amount || 0) * 0.7 : 0;
      return { ...order, status, income };
    })
    .filter((o) => o.status === "confirmed" || o.status === "delivered");

  // Totals
  const totalEarnings = myParcels.reduce((sum, p) => sum + p.income, 0);
  const totalDeliveries = myParcels.length;

  // Pending parcels & amount
  const pendingParcels = myParcels.filter((p) => {
    const cashoutData = cashoutsData.find((c) => c.trackingId === p.trackingId);
    return !(cashoutData?.cashoutStatus === "Cashouted" || cashOutStatus[p.trackingId]);
  });
  const totalPending = pendingParcels.reduce((sum, p) => sum + p.income, 0);

  // Handle cash out
  const handleCashOut = async (order) => {
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

      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["tracking"]);
      queryClient.invalidateQueries(["cashoutsData"]);

      toast.success(`Cash Out successful: $${order.income.toFixed(2)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cash Out failed! Try again.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <h2 className="text-3xl font-bold mb-6">My Earnings</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4">
          <div className="text-3xl">📦</div>
          <div>
            <p className="text-gray-400 dark:text-gray-300 uppercase text-sm">Total Deliveries</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDeliveries}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4">
          <div className="text-3xl">💰</div>
          <div>
            <p className="text-gray-400 dark:text-gray-300 uppercase text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-4">
          <div className="text-3xl">⏳</div>
          <div>
            <p className="text-gray-400 dark:text-gray-300 uppercase text-sm">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${totalPending.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Parcel List */}
      {myParcels.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No deliveries or earnings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myParcels.map((order) => {
            const cashoutData = cashoutsData.find((c) => c.trackingId === order.trackingId);
            const isCashouted = cashoutData?.cashoutStatus === "Cashouted" || cashOutStatus[order.trackingId];

            return (
              <div
                key={order.trackingId}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transition relative flex flex-col"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    isCashouted
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                  }`}
                >
                  {isCashouted ? "Cashouted" : "Pending"}
                </span>

                <h3 className="text-lg font-semibold mb-2">{order.title || "Parcel"}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tracking ID: {order.trackingId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount: ${order.amount?.toFixed(2) || 0}</p>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">Income: ${order.income.toFixed(2)}</p>
                {cashoutData?.cashoutTime && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Cash Out Time: {cashoutData.cashoutTime}</p>
                )}

                <button
                  disabled={isCashouted || order.status !== "delivered"}
                  onClick={() => handleCashOut(order)}
                  className={`mt-auto py-2 rounded-lg font-semibold text-white transition ${
                    isCashouted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                >
                  {order.status === "delivered" ? "Cash Out" : "Parcel On The Way"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEarnings;