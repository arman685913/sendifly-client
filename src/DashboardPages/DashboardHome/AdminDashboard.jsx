import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import CountUp from "react-countup";
import { motion } from "framer-motion";

import {
  FaUsers,
  FaUserCheck,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // 🔄 Data Fetch
  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => (await axiosSecure.get("/user")).data,
  });

  const { data: parcels = [] } = useQuery({
    queryKey: ["all-parcels"],
    queryFn: async () => (await axiosSecure.get("/parcels")).data,
  });

  const { data: riders = [] } = useQuery({
    queryKey: ["all-riders"],
    queryFn: async () => (await axiosSecure.get("/riders")).data,
  });

  // 📊 Calculations
  const totalUsers = users.length;
  const totalRiders = riders.length;
  const totalParcels = parcels.length;

  //admin
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalNormalUsers = users.filter(u => u.role === "user").length;

  const delivered = parcels.filter(p => p.deliveryStatus === "delivered").length;
  const pending = parcels.filter(p => p.deliveryStatus === "pending").length;

  const totalRevenue = parcels
    .filter(p => p.deliveryStatus === "delivered")
    .reduce((sum, p) => {
      return sum + (p.senderDistrict === p.riderDistrict
        ? p.deliveryCost * 0.7
        : p.deliveryCost * 0.3);
    }, 0);


  //  Card Component
  const Card = ({ title, value, icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="p-5 rounded-2xl shadow-md flex gap-4 items-center 
      bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
    >
      <div className="text-3xl text-white bg-indigo-500 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3>{title}</h3>
        <p className="text-2xl font-bold">
          <CountUp end={value} duration={1.5} separator="," />
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black min-h-screen">

      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Admin Dashboard 🛠️
      </h2>

      {/* 🔢 Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Card title="Users" value={totalUsers} icon={<FaUsers />} delay={0} />
        <Card title="Riders" value={totalRiders} icon={<FaUserCheck />} delay={0.1} />
        <Card title="Parcels" value={totalParcels} icon={<FaBox />} delay={0.2} />
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Card title="Pending" value={pending} icon={<FaClock />} delay={0.3} />
        <Card title="Delivered" value={delivered} icon={<FaCheckCircle />} delay={0.4} />
        <Card title="Revenue" value={parseFloat(totalRevenue.toFixed(2))} icon={<FaMoneyBillWave />} delay={0.5} />
      </div>

      {/*  Modern Charts */}
      <div className="grid md:grid-cols-3 gap-6">

        {/*  User Role Distribution */}
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 dark:text-white">User Distribution</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                {
                  name: "System",
                  Users: totalNormalUsers,
                  Riders: totalRiders,
                  Admins: totalAdmins,
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="Users" fill="#3b82f6" />
              <Bar dataKey="Riders" fill="#22c55e" />
              <Bar dataKey="Admins" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/*  Radial */}
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 dark:text-white">Delivery Success</h3>

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
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>

          <p className="text-center text-xl font-bold mt-2 dark:text-white">
            {delivered} / {totalParcels}
          </p>
        </div>



        {/*  Area */}
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="mb-4 dark:text-white">Revenue Flow</h3>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={[
                { name: "Mon", revenue: 400 },
                { name: "Tue", revenue: 900 },
                { name: "Wed", revenue: 700 },
                { name: "Thu", revenue: 1200 },
                { name: "Fri", revenue: 1500 },
              ]}
            >
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <p className="text-center mt-2 font-bold dark:text-white">
            ৳ {totalRevenue.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;