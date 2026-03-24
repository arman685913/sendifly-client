import React from "react";
import { CreditCard } from "lucide-react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router";
import { format } from "date-fns";

const HistoryTable = ({ paymentsData }) => {


  if (paymentsData.length === 0) {
    return (
      <div className="mx-3 my-5 text-center p-14 border-2 border-dashed border-lime-300 rounded-2xl">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="p-4 mx-2 lg:mx-4 my-3 lg:my-6 bg-base-100 rounded-xl shadow-sm border border-lime-400">

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-md w-full">
          <thead className="bg-lime-200 dark:bg-lime-700 text-lime-900 dark:text-white">
            <tr>
              <th>#</th>
              <th>Parcel Info</th>
              <th>Tracking ID</th>
              <th>Transaction</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Track</th>
            </tr>
          </thead>

          <tbody>
            {paymentsData.map((item, index) => (

              <tr key={item._id} className="hover:bg-lime-50 dark:hover:bg-gray-800 transition-colors">
                <th className="opacity-50">{index + 1}</th>
                {console.log(item)}
                <td className="font-semibold capitalize text-gray-800 dark:text-gray-200">
                  {item.title}
                </td>

                <td className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  {item.trackingId}
                </td>

                <td className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  {item.transactionId.slice(-12)}
                </td>

                <td>
                  <span className="badge bg-lime-600 text-white border-none capitalize">
                    {item.method}
                  </span>
                </td>

                <td className="font-bold text-lime-700 dark:text-lime-400">
                  {item.amount} ৳
                </td>

                <td className="text-xs text-base-content">

                  <span className="font-semibold text-lime-700">
                    {item.date}
                  </span>

                  <span className="opacity-60">
                    {item.paymentDate}
                  </span>

                </td>

                <td className="font-bold text-lime-700 dark:text-lime-400">
                  <Link state={item.trackingId} to="/dashboard/payments/track">
                    <FaMapLocationDot size={29} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Mobile View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paymentsData.map((item) => (
          <div
            key={item._id}
            className="card bg-white dark:bg-gray-800 border border-lime-400 dark:border-lime-700 shadow-sm"
          >
            <div className="card-body p-4 gap-2 text-gray-800 dark:text-gray-200">

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lime-800 dark:text-lime-400">
                    {item.title}
                  </h2>

                  <p className="text-[10px] opacity-70 font-bold">
                    Tracking: {item.trackingId}
                  </p>

                  <p className="text-[10px] opacity-70 font-bold">
                    TX: {item.transactionId.slice(-10)}
                  </p>
                </div>

                <span className="badge bg-lime-600 text-white border-none capitalize">
                  {item.method}
                </span>
              </div>

              <div className="divider my-1 before:bg-lime-100 after:bg-lime-100 dark:before:bg-gray-700 dark:after:bg-gray-700"></div>

              <div className="flex justify-between text-sm">
                <span className="opacity-70">Amount</span>
                <span className="font-bold text-lime-700 dark:text-lime-400">
                  {item.amount} ৳
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="opacity-70">Payment Date</span>
                <span className="text-lime-700 dark:text-lime-400 font-medium">
                  {item.paymentDate}
                </span>
              </div>

              <div className="card-actions justify-end mt-3 gap-2">
                <button className="btn btn-sm bg-lime-600 dark:bg-lime-700 text-white border-none flex items-center gap-1">
                  <CreditCard size={16} /> Paid
                </button>
                <Link
                  className="btn btn-sm bg-white dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600 flex items-center gap-1"
                  state={item.trackingId}
                  to="/dashboard/payments/track"
                >
                  <FaMapLocationDot size={14} /> Track
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HistoryTable;