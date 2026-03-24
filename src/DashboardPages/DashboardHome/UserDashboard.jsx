import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Hooks/Loader";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from "recharts";

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myParcels = [], isLoading } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <Loader />
      </div>
    );
  }

  // Stats
  const totalParcels = myParcels.length;
  const delivered = myParcels.filter((p) => p.deliveryStatus === "delivered").length;
  const pending = myParcels.filter((p) => p.deliveryStatus === "pending").length;

  // Animated Card Component
  const Card = ({ title, value, delay, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-2xl shadow-md flex flex-col justify-center items-center ${color} text-gray-800 dark:text-white`}
    >
      <h3>{title}</h3>
      <p className="text-2xl font-bold">
        <CountUp end={value} duration={1.5} />
      </p>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 dark:text-white">User Dashboard 👤</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Card title="Total Parcels" value={totalParcels} delay={0} color="bg-blue-100 dark:bg-blue-800" />
        <Card title="Delivered" value={delivered} delay={0.1} color="bg-green-100 dark:bg-green-800" />
        <Card title="Pending" value={pending} delay={0.2} color="bg-yellow-100 dark:bg-yellow-800" />
      </div>

      {/* Radial Delivery Success */}
      <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <h3 className="mb-4 dark:text-white text-lg font-semibold">Delivery Success</h3>

        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={[
              {
                name: "Delivered",
                value: totalParcels ? (delivered / totalParcels) * 100 : 0,
                fill: "#22c55e",
              },
            ]}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" cornerRadius={10} />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          </RadialBarChart>
        </ResponsiveContainer>

        <p className="text-center text-xl font-bold mt-2 dark:text-white">
          {delivered} / {totalParcels} Delivered
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;