import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Hooks/Loader";
import {
  FaTruck,
  FaCheckCircle,
  FaHourglassHalf,
  FaDollarSign,
} from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const RiderDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: cashoutsData = [], isLoading } = useQuery({
    queryKey: ["cashoutsData", user?.email],
    queryFn: async () =>
      (await axiosSecure.get(`/rider/cashout?riderEmail=${user?.email}`))
        .data.cashouts || [],
  });

  if (isLoading) return <Loader />;

  // Stats
  const totalDeliveries = cashoutsData.length;
  const completed = cashoutsData.filter((c) => c.cashoutStatus === "Cashouted");
  const pending = cashoutsData.filter((c) => c.cashoutStatus !== "Cashouted");
  const totalEarnings = cashoutsData.reduce((sum, p) => sum + (p.income || 0), 0);

  // Pie chart data
  const pieData = [
    { name: "Completed", value: completed.length },
    { name: "Pending", value: pending.length },
  ];
  const COLORS = ["#22c55e", "#facc15"];

  // Earnings per delivery data
  const earningsPerDeliveryData = cashoutsData.map((d, idx) => ({
    name: d.trackingId || `Parcel ${idx + 1}`,
    income: d.income || 0,
  }));

  // Card Component: icon left, text right
  const Card = ({ title, value, delay, Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="p-5 rounded-2xl shadow-lg flex items-center gap-4
                 bg-white/60 dark:bg-white/10 backdrop-blur-lg text-gray-800 dark:text-white"
    >
      {/* Icon Left */}
      {Icon && (
        <div className="text-3xl text-blue-500 dark:text-blue-400">
          <Icon />
        </div>
      )}

      {/* Title + Value */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xl font-bold">
          <CountUp end={value} duration={1.5} separator="," />
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        Rider Dashboard 🚴
      </h2>

      {/* Stats Cards Grid */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <Card title="Total Deliveries" value={totalDeliveries} delay={0} Icon={FaTruck} />
        <Card title="Completed" value={completed.length} delay={0.1} Icon={FaCheckCircle} />
        <Card title="Pending" value={pending.length} delay={0.2} Icon={FaHourglassHalf} />
        <Card title="Total Earnings" value={parseFloat(totalEarnings.toFixed(2))} delay={0.3} Icon={FaDollarSign} />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* Delivery Status PieChart */}
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Delivery Status</h3>
          <div className="relative w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  startAngle={90}
                  endAngle={450}
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} deliveries`} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
              <span className="text-2xl font-bold dark:text-white">
                {completed.length} / {totalDeliveries}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-300">Completed</span>
            </div>
          </div>
        </div>

        {/* Earnings per Delivery BarChart */}
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Earnings per Delivery 💰</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={earningsPerDeliveryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `৳ ${value}`} />
              <Legend />
              <Bar dataKey="income" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default RiderDashboard;