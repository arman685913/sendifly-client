import { toast } from "react-toastify";
import useAxiosSecure from "./useAxiosSecure";

const useTracking = () => {

  const axiosSecure = useAxiosSecure();

  // Add new tracking update
  const addTrackingUpdate = async (trackingData) => {
    try {

      const res = await axiosSecure.post("/tracking", trackingData);

      if (res.data.insertedId) {
        toast.success("Tracking added successfully");
      }

      return res.data;

    } catch (error) {
      toast.error("Tracking add failed");
      console.error(error);
    }
  };

  // Update tracking
  const updateTrackingUpdate = async (trackingId, trackingData) => {
    try {

      const res = await axiosSecure.patch(`/tracking/${trackingId}`, trackingData);

      toast.success("Tracking updated successfully");

      return res.data;

    } catch (error) {
      toast.error("Tracking update failed");
      console.error(error);
    }
  };

  return { addTrackingUpdate, updateTrackingUpdate };
};

export default useTracking;