import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWeightHanging } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceData from "../../assets/warehouses.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useTracking from "../../Hooks/useTracking";

const MySwal = withReactContent(Swal);

// Tracking id generator
const generateTrackingId = () => {
  const pfx = "SDF";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${pfx}-${date}-${random}`;
};

// LocationSelect Component
const LocationSelect = ({ label, prefix, register, data, setValue, errors }) => {
  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);

  const handleRegionChange = (region) => {
    const dist = data.filter((item) => item.region === region).map((i) => i.district);
    setDistricts([...new Set(dist)]);
    setCenters([]);
    setValue(`${prefix}District`, "");
    setValue(`${prefix}Center`, "");
  };

  const handleDistrictChange = (district) => {
    const centerData = data.find((item) => item.district === district);
    setCenters(centerData?.covered_area || []);
    setValue(`${prefix}Center`, "");
  };

  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="border p-4 rounded-xl border-gray-400 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{label}</h3>
      <div className="grid gap-4">

        <div>
          <input
            {...register(`${prefix}Name`, { required: true })}
            placeholder={`${label} Name`}
            className="input input-bordered uppercase w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors[`${prefix}Name`] && <p className={errorClass}>Name is required</p>}
        </div>

        <div>
          <input
            {...register(`${prefix}Contact`, {
              required: true,
              minLength: 11,
              maxLength: 11,
              validate: {
                bdnum: (value) =>
                  /^01[3-9]\d{8}$/.test(value) || "Enter a valid Bangladeshi phone number"
              }
            })}
            placeholder={`${label} Contact`}
            className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors[`${prefix}Contact`] && <p className={errorClass}>{errors[`${prefix}Contact`].message || "Contact is invalid"}</p>}
        </div>

        <div>
          <select
            {...register(`${prefix}Region`, { required: true })}
            className="select select-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">Select Region</option>
            {[...new Set(data.map((i) => i.region))].map((r, i) => (
              <option key={i}>{r}</option>
            ))}
          </select>
          {errors[`${prefix}Region`] && <p className={errorClass}>Region is required</p>}
        </div>

        <div>
          <select
            {...register(`${prefix}District`, { required: true })}
            className="select select-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleDistrictChange(e.target.value)}
          >
            <option value="">Select District</option>
            {districts.map((d, i) => <option key={i}>{d}</option>)}
          </select>
          {errors[`${prefix}District`] && <p className={errorClass}>District is required</p>}
        </div>

        <div>
          <select
            {...register(`${prefix}Center`, { required: true })}
            className="select select-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Service Center</option>
            {centers.map((c, i) => <option key={i}>{c}</option>)}
          </select>
          {errors[`${prefix}Center`] && <p className={errorClass}>Center is required</p>}
        </div>

        <div>
          <input
            {...register(`${prefix}Address`, { required: true })}
            placeholder={`${label} Address`}
            className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors[`${prefix}Address`] && <p className={errorClass}>Address is required</p>}
        </div>

        <div>
          <input
            {...register(`${prefix}Instruction`, { required: true })}
            placeholder={`${label} Instruction`}
            className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors[`${prefix}Instruction`] && <p className={errorClass}>Instruction is required</p>}
        </div>

      </div>
    </div>
  );
};


// Main Pricing Component
const Pricing = () => {

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } =
    useForm({ defaultValues: { type: "document" } });

  const watchType = watch("type");

  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { addTrackingUpdate } = useTracking();

  const onSubmit = (data) => {

    const TrackingId = generateTrackingId();

    const sameDistrict = data.senderDistrict === data.receiverDistrict;

    let base = 0;
    let extraWeight = 0;
    let districtCharge = 0;
    let totalCost = 0;

    if (data.type === "document") {
      base = sameDistrict ? 60 : 80;
      totalCost = base;
    } else {
      const weight = parseFloat(data.weight || 0);
      base = sameDistrict ? 110 : 150;
      if (weight > 3) extraWeight = Math.ceil(weight - 3) * 40;
      if (!sameDistrict) districtCharge = 40;
      totalCost = base + extraWeight + districtCharge;
    }

    const parcelData = {
      ...data,
      createdBy: user.email,
      deliveryCost: totalCost,
      trackingId: TrackingId,
      deliveryStatus: "not_collected",
      paymentStatus: "unpaid",
      creation_date: new Date().toISOString()
    };

    MySwal.fire({
      title: `<span style="font-size:28px;">Delivery Cost: <span style="color:red;">${totalCost} ৳</span></span>`,
      html: `
        <div style="text-align:left; font-size:16px; line-height:1.6; text-transform: uppercase;">
        <p style="font-size:18px; font-weight:bold;">
        Tracking ID:
        <span style="color:#16a34a;">${TrackingId}</span>
        </p>
          <p style="color:green; font-size:18px;"><b>Parcel Name: ${data.title}</b></p>
          <p style="margin-bottom:5px;font-size:12px;">(${data.type})</p>

          <p style="font-weight:bold;">Base Cost:<span style="color:blue;"> ${base} ৳</span></p>
          ${extraWeight ? `<p><b>Extra Weight Cost:</b> ${extraWeight} ৳</p>` : ""}
          ${districtCharge ? `<p><b>District Difference Charge:</b> ${districtCharge} ৳</p>` : ""}
          <hr/>
          <p style="font-size:18px; font-weight:bold; color:green;"><b>Total Cost:</b> ${totalCost} ৳</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      customClass: {
        popup: "shadow-lg rounded-xl dark:bg-gray-800 dark:text-white"
      }
    }).then((result) => {

      if (result.isConfirmed) {

        axiosSecure.post("/parcels", parcelData)
          .then(response => {

            if (response.data.insertedId) {  

              toast.success(`Parcel ${data.title} successfully added!`);

              const trackingData = {
                trackingId: parcelData.trackingId,
                parcelId: response.data.insertedId,
                deliveryStatus: parcelData.deliveryStatus,
                locationSenderDistrict: parcelData.senderDistrict,
                locationSenderCenter: parcelData.senderCenter,
                locationSenderAddress: parcelData.senderAddress,
                locationReceiverDistrict: parcelData.receiverDistrict,
                locationReceiverCenter: parcelData.receiverCenter,
                locationReceiverAddress: parcelData.receiverAddress,
                note: "Waiting for Pickup",
                updatedBy: "Admin",
                email: user.email,
                orderDate: new Date().toLocaleString(),
                paymentDate: 'Not Paid'
              };

              addTrackingUpdate(trackingData);

              reset();

              navigate(`/dashboard/payment/${response.data.insertedId}`);
            }

          })
          .catch(() => {
            toast.error("Parcel creation failed");
          });

      }

    });

  };

  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="lg:my-5 md:my-4 my-3 mx-2 p-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">Add Parcel</h2>
      <p className="font-bold text-xl mb-6 text-gray-600 dark:text-gray-300">Enter your parcel details</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="border p-4 rounded-xl border-gray-400 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Parcel Info</h3>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

            <div className="flex flex-col md:flex-row gap-4 flex-1">

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="document" {...register("type", { required: true })} className="radio radio-success focus:outline-none" />
                Document
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="non-document" {...register("type", { required: true })} className="radio radio-success focus:outline-none" />
                Non-Document
              </label>

            </div>

            {errors.type && <p className={errorClass}>Parcel type is required</p>}

            <div className="flex flex-1 flex-col md:flex-row gap-4 items-center mt-2 md:mt-0">

              <div className="w-full">
                <input type="text" {...register("title", { required: true })} placeholder="Parcel Title" className="input input-bordered md:w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase" />
                {errors.title && <p className={errorClass}>Title is required</p>}
              </div>

              {watchType === "non-document" && (
                <div className="relative w-full md:w-auto">
                  <input type="number" step="0.01" {...register("weight", { required: true })} placeholder="Weight (kg)" className="input input-bordered w-full focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <FaWeightHanging className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
                </div>
              )}

            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationSelect label="Sender Info" prefix="sender" register={register} data={ServiceData} setValue={setValue} errors={errors} />
          <LocationSelect label="Receiver Info" prefix="receiver" register={register} data={ServiceData} setValue={setValue} errors={errors} />
        </div>

        <div className="flex items-center flex-col-reverse md:flex-row justify-between gap-4">
          <button type="submit" className="btn btn-success w-full md:w-auto mt-4">
            Proceed to Confirm Booking
          </button>
          <p className="text-gray-600 dark:text-gray-300">* PickUp Time 4pm-7pm Approx.</p>
        </div>

      </form>
    </div>
  );
};

export default Pricing;