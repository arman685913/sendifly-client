import React, { useState } from "react";
import { useForm } from "react-hook-form";
import RiderImg from "../../../src/assets/agent-pending.png";
import ServiceData from "../../assets/warehouses.json";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../Hooks/Loader";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TbPhotoUp } from "react-icons/tb";

const Rider = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Current user info
  const { isLoading, data: User = {} } = useQuery({
    queryKey: ['User'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user.email}`);
      return res.data;
    }
  });

  // Fetch rider data by email
  const { data: userData = {} } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?email=${user.email}`);
      return res.data[0];
    }
  });

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [userImg, setUserImg] = useState(null);

  // UNIQUE REGIONS
  const regions = [...new Set(ServiceData.map(item => item.region))];

  // FILTER DISTRICTS BY REGION
  const districts = [
    ...new Set(ServiceData.filter(item => item.region === selectedRegion)
      .map(item => item.district))
  ];

  // FILTER WAREHOUSES BY DISTRICT
  const warehouses = ServiceData.filter(item => item.district === selectedDistrict);


  // Handle image upload to ImgBB
  const handleImg = async (e) => {
    const img = e.target.files[0];
    if (!img) return;

    const formData = new FormData();
    formData.append("image", img);

    const apiKey = import.meta.env.VITE_IMBB_API;

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );

      const imageUrl = res.data.data.url;
      setUserImg(imageUrl);
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed");
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!userImg) {
      toast.error("Please upload an image");
      return;
    }

    const userData = {
      ...data,
      img: userImg,
      email: user.email,
      status: "pending",
      created_at: new Date().toLocaleString()
    };

    axiosSecure.post("/riders", userData)
      .then(res => {
        if (res.data.insertedId) {
          toast.info("Welcome to the Sendifly rider family");
          navigate("/");
          reset();
          setUserImg(null);
        }
      })
      .catch(() => {
        toast.error("Rider creation failed");
      });
  };

  if (isLoading) return <Loader />;


  return (
    <div className="bg-base-200 py-8 border-gray-400 shadow-md px-4 mx-2 md:mx-4 my-5 border rounded-2xl">
      <div className="max-w-6xl mx-auto bg-base-100 rounded-2xl p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3 text-primary">
            Be a Rider
          </h2>
          <p className="lg:w-1/2 text-sm text-gray-500">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
            From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        <div className="divider"></div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {User.role !== 'rider' ?
          <div>
            <h3 className="text-xl font-semibold mb-6">Tell us about yourself</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* IMAGE UPLOAD */}
                <div className="md:col-span-2">
                  <label className="cursor-pointer flex items-center gap-2 border border-gray-300 p-3 rounded-md hover:bg-base-200">
                    <TbPhotoUp size={32} className="text-lime-600" />
                    <span>{userImg ? "Image Uploaded " : "Upload Photo"}</span>
                    <input
                      type="file"
                      {...register("img", { required: true })}
                      onChange={handleImg}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {errors.img?.type === "required" && (
                    <p className="text-red-500 text-xs mt-1">Image is required</p>
                  )}
                </div>

                {/* NAME */}
                <div>
                  <input
                    placeholder="Your Name"
                    className="input input-bordered w-full"
                    {...register("name", { required: "Name is required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                </div>

                {/* AGE */}
                <div>
                  <input
                    type="number"
                    placeholder="Your Age"
                    className="input input-bordered w-full"
                    {...register("age", { required: "Age is required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.age?.message}</p>
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={user?.email || ""}
                    readOnly
                    {...register("email", { required: "Email is required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                </div>

                {/* CONTACT */}
                <div>
                  <input
                    placeholder="Contact Number"
                    className="input input-bordered w-full"
                    {...register("contact", { required: "Contact required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.contact?.message}</p>
                </div>

                {/* BIKE NAME */}
                <div>
                  <input
                    placeholder="Bike Name"
                    className="input input-bordered w-full"
                    {...register("bikeName", { required: "Bike name required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.bikeName?.message}</p>
                </div>

                {/* BIKE REG */}
                <div>
                  <input
                    placeholder="Bike Registration Number"
                    className="input input-bordered w-full"
                    {...register("bikeReg", { required: "Bike registration required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.bikeReg?.message}</p>
                </div>

                {/* NID */}
                <div>
                  <input
                    placeholder="NID / Driving Licence"
                    className="input input-bordered w-full"
                    {...register("nid", { required: "NID or Licence required" })}
                  />
                  <p className="text-red-500 text-xs mt-1">{errors.nid?.message}</p>
                </div>

                {/* REGION */}
                <div>
                  <select
                    className="select select-bordered w-full"
                    {...register("region", { required: "Region required" })}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedDistrict("");
                    }}
                  >
                    <option value="">Select Region</option>
                    {regions.map(region => <option key={region} value={region}>{region}</option>)}
                  </select>
                  <p className="text-red-500 text-xs mt-1">{errors.region?.message}</p>
                </div>

                {/* DISTRICT */}
                <div>
                  <select
                    className="select select-bordered w-full"
                    {...register("district", { required: "District required" })}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => <option key={district} value={district}>{district}</option>)}
                  </select>
                  <p className="text-red-500 text-xs mt-1">{errors.district?.message}</p>
                </div>

                {/* COVERED AREA */}
                <div>
                  <select
                    className="select select-bordered w-full"
                    {...register("warehouse", { required: "Covered area required" })}
                  >
                    <option value="">Select Covered Area</option>
                    {warehouses.map(item =>
                      item.covered_area.map((area, i) => (
                        <option key={i} value={area}>{area}</option>
                      ))
                    )}
                  </select>
                  <p className="text-red-500 text-xs mt-1">{errors.warehouse?.message}</p>
                </div>



                {/* SUBMIT BUTTON */}
                <div className="md:col-span-2">
                  <button className="btn bg-lime-400 hover:bg-lime-500 border-none w-full">
                    Submit
                  </button>
                </div>

              </div>
            </form>
          </div> :
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-md shadow-md">
            {console.log(userData)}
            <h2 className="text-2xl font-bold mb-2">Rider Profile</h2>
            <p><strong>Name:</strong> {userData.name || "N/A"}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Contact:</strong> {userData.contact}</p>
            <p><strong>Bike Name:</strong> {userData.bikeName}</p>
            <p><strong>Bike Reg:</strong> {userData.bikeReg}</p>
            <p><strong>NID:</strong> {userData.nid}</p>
            <p><strong>Region:</strong> {userData.region}</p>
            <p><strong>District:</strong> {userData.district}</p>
            <p><strong>Covered Area:</strong> {userData.warehouse}</p>
            <p><strong>Status:</strong> {userData.status}</p>
            <p><strong>Joined:</strong> {userData.created_at}</p>

            {userData.img && (
              <div className="mt-4">
                <img
                  src={userData.img}
                  alt="Rider"
                  className="w-32 h-32 rounded-full border shadow-sm"
                />
              </div>
            )}
          </div>
          }
          {/* IMAGE */}
          <div className="flex justify-center">
            <img src={RiderImg} alt="Rider" className="max-w-md w-full" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rider;