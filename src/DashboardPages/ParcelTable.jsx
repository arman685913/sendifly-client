import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Eye, CreditCard, Trash2 } from "lucide-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const ParcelTable = ({ parcels, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  //  modal state
  const [selectedParcel, setSelectedParcel] = useState(null);

  // view handler (open modal)
  const handleView = (parcel) => {
    setSelectedParcel(parcel);
    document.getElementById("parcel_modal").showModal();
  };

  const handlePay = (parcel) => navigate(`/dashboard/payment/${parcel._id}`);

  const handleDelete = (parcelId, parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#84cc16",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton:
          "btn bg-lime-500 hover:bg-lime-600 text-white border-none mx-2",
        cancelButton: "btn btn-ghost mx-2",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcels/${parcelId}`)
          .then((response) => {
            if (response.data.deletedCount) {
              refetch();
              toast.error(`Deleted parcel: ${parcel.trackingId}`);
              Swal.fire({
                title: "Deleted!",
                text: "The parcel has been removed.",
                icon: "success",
                iconColor: "#84cc16",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              toast.warning("Parcel not found or already deleted.");
            }
          })
          .catch((err) => {
            toast.error("Failed to delete parcel. Try again.");
            console.error(err);
          });
      }
    });
  };

  if (parcels.length === 0) {
    return (
      <div className="mx-3 my-5 text-center p-14 border-2 border-dashed border-lime-300 rounded-2xl">
        No Parcel found.
      </div>
    );
  }

  return (
    <div className="p-4 mx-2 lg:mx-4 my-3 lg:my-6 bg-base-300 rounded-xl shadow-sm border border-base-300">

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-md w-full">
          <thead className="bg-lime-200 text-black">
            <tr>
              <th>#</th>
              <th>Parcel Info</th>
              <th>Receiver</th>
              <th>Date & Time</th>
              <th>Cost</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id} className="hover:bg-base-200 transition-colors">
                <th className="opacity-50">{index + 1}</th>

                <td>
                  <div className="flex flex-col">
                    <span className="font-bold">{parcel.title}</span>
                    <span className="text-xs opacity-70">{parcel.type}</span>
                  </div>
                </td>

                <td>{parcel.receiverName}</td>

                <td className="text-xs">
                  <span className="font-semibold text-lime-700">
                    {format(new Date(parcel.creation_date), "dd MMM, yyyy")}
                  </span>
                  <br />
                  <span className="opacity-50">
                    {format(new Date(parcel.creation_date), "hh:mm a")}
                  </span>
                </td>

                <td className="font-bold text-lime-700">
                  {parcel.deliveryCost} ৳
                </td>

                <td>
                  {parcel.deliveryStatus !== 'delivered' ?
                    <span
                      className={`badge badge-sm font-bold border-none ${parcel.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                        }`}
                    >
                      {parcel.paymentStatus.toUpperCase()}
                    </span> :
                    <span
                      className={`badge badge-sm font-bold border-none ${parcel.deliveryStatus === "delivered"
                          ? "badge-success"
                          : "badge-error"
                        }`}
                    >
                      {parcel.deliveryStatus.toUpperCase()}
                    </span>
                  }
                </td>

                <td>
                  <div className="flex justify-center gap-2">

                    {/* Pay */}
                    {parcel.paymentStatus === "unpaid" ? (
                      <button
                        className="btn btn-square btn-ghost btn-xs text-blue-500"
                        onClick={() => handlePay(parcel)}
                      >
                        <CreditCard size={18} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-square btn-ghost btn-xs text-green-500"
                        onClick={() => toast.success("Already Paid")}
                      >
                        <CreditCard size={18} />
                      </button>
                    )}

                    {/* View */}
                    <button
                      className="btn btn-square btn-ghost btn-xs"
                      onClick={() => handleView(parcel)}
                    >
                      <Eye size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-square btn-ghost btn-xs text-red-600"
                      onClick={() => handleDelete(parcel._id, parcel)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {parcels.map((parcel) => (
          <div key={parcel._id} className="card bg-base-100 border shadow-sm">
            <div className="card-body p-4">

              <h2 className="card-title text-lime-700">{parcel.title}</h2>
              <div className="absolute right-2">
              {parcel.deliveryStatus !== 'delivered' ? <div className="uppercase border rounded-2xl px-2 text-red-600">{parcel.deliveryStatus}</div> : <div className="uppercase border rounded-2xl px-2 text-lime-600">{parcel.deliveryStatus}</div>
              }</div>

              <p className="text-sm opacity-70">{parcel.receiverName}</p>

              <p className="text-sm">
                {format(new Date(parcel.creation_date), "dd-MM-yy hh:mm a")}
              </p>

              <p className="font-bold text-lime-600">
                {parcel.deliveryCost} ৳
              </p>

              <div className="flex gap-2 mt-3">

                <button
                  className="btn btn-sm"
                  onClick={() => handleView(parcel)}
                >
                  View
                </button>

                {parcel.paymentStatus === "unpaid" ? (
                  <button
                    className="btn btn-sm bg-lime-600 text-white"
                    onClick={() => handlePay(parcel)}
                  >
                    Pay
                  </button>
                ) : (
                  <button className="btn btn-sm btn-disabled">
                    Paid
                  </button>
                )}

                <button
                  className="btn btn-sm btn-ghost text-red-600"
                  onClick={() => handleDelete(parcel._id, parcel)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*  Modal */}
      <dialog id="parcel_modal" className="modal modal-middle">
        <div className="modal-box max-w-lg">

          {/* Close */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg text-lime-700 mb-4">
            Parcel Details
          </h3>

          {selectedParcel && (
            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {selectedParcel.title}</p>
              <p><strong>Type:</strong> {selectedParcel.type}</p>
              <p><strong>Tracking ID:</strong> {selectedParcel.trackingId}</p>
              <p><strong>Receiver:</strong> {selectedParcel.receiverName}</p>
              <p>
                <strong>Date:</strong>{" "}
                {format(new Date(selectedParcel.creation_date), "dd MMM yyyy, hh:mm a")}
              </p>
              <p><strong>Cost:</strong> {selectedParcel.deliveryCost} ৳</p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedParcel.deliveryStatus !== 'delivered' ?
                  <span
                    className={`badge ${selectedParcel.paymentStatus === "paid"
                        ? "badge-success uppercase"
                        : "badge-error uppercase"
                      }`}
                  >
                    {selectedParcel.paymentStatus}
                  </span> :
                  <span
                    className={`badge ${selectedParcel.deliveryStatus == 'delivered'
                        ? "badge-success uppercase "
                        : "badge-error uppercase"
                      }`}
                  >
                    {selectedParcel.deliveryStatus}
                  </span>
                }
              </p>
            </div>
          )}

        </div>
      </dialog>

    </div>
  );
};

export default ParcelTable;