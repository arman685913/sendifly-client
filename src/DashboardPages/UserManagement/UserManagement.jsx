import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUserShield, FaTrash, FaSearch, FaUserEdit, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axios = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["user", query],
    queryFn: async () => {
      const res = await axios.get(`/user?search=${query}`);
      return res.data;
    },
  });

  const handleMakeAdmin = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    // Optimistic UI could be added here, but for now, standard feedback:
    const res = await axios.patch(`/user/${user._id}`, { role: newRole });

    if (res.data.modifiedCount > 0) {
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: `${user.name} is now a ${newRole}`,
        toast: true,
        position: 'top-end',
        timer: 2500,
        showConfirmButton: false,
      });
      refetch();
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove User?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl'
      }
    });

    if (confirm.isConfirmed) {
      const res = await axios.delete(`/user/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "User has been removed.", "success");
        refetch();
      }
    }
  };

  const handleSearch = () => setQuery(search.trim());
  const clearSearch = () => { setSearch(""); setQuery(""); };

  // Skeleton Loader Component
  if (isLoading) return (
    <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(n => (
        <div key={n} className="h-48 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-base-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight dark:text-white">
            User <span className="text-indigo-600">Management</span>
          </h2>
          <p className="text-gray-500 mt-1">Assign roles and manage platform permissions</p>
        </div>

        {/* Search Bar */}
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-10 py-3 bg-base-100 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
            {search && (
              <button onClick={clearSearch} className="absolute right-3 top-4 text-gray-400 hover:text-red-500">
                <FaTimes />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="group relative bg-base-100 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Role Badge */}
            <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {user.role || 'user'}
            </span>

            {/* Avatar */}
            <div className="relative mb-4">
              <img
                className="w-32 h-32 rounded-2xl p-2 object-cover ring-1 ring-gray-300 group-hover:ring-indigo-50 shadow-md"
                src={user.userImg || "https://via.placeholder.com/150"}
                alt={user.name}
              />
              <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${user.role === 'admin' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>

            <h3 className="text-xl font-bold truncate w-full">{user.name}</h3>
            <p className="text-sm text-gray-400 mb-6 truncate w-full">{user.email}</p>

            {/* Actions */}
            <div className="flex w-full gap-2 mt-auto">
              <button
                onClick={() => handleMakeAdmin(user)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  user.role === "admin"
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <FaUserShield size={16} />
                {user.role === "admin" ? "Demote" : "Make Admin"}
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                title="Delete User"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-200 p-4 rounded-full mb-4">
            <FaSearch className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
          <button onClick={clearSearch} className="mt-4 text-indigo-600 font-semibold hover:underline">
            View all users
          </button>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;