import React from "react";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";
import Loader from "../../Hooks/Loader";

const DashboardHome = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user.email}`);
      return res.data;
    },
  });

  if (loading || isLoading) {
    return <div className="text-center mt-10"><Loader></Loader></div>;
  }

  const role = userInfo?.role;

  //dashboard render
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "rider") {
    return <RiderDashboard />;
  }

  return <UserDashboard />;
};

export default DashboardHome;