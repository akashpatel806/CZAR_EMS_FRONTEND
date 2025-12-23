// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const BASE_URL = "http://localhost:5000"; // change for production

// export const useLeaveRequest = () => {
//   const [loading, setLoading] = useState(false);

//   const submitLeave = async (formData) => {
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `${BASE_URL}/api/employee/leave-requests`,
//         formData,
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );

//       toast.success(response.data.message);
//       return response.data; // return data for additional actions
//     } catch (error) {
//       console.error("Leave Submit Error:", error);
//       toast.error(error.response?.data?.message || "Failed to submit leave");
//       throw error; // rethrow for UI handling if needed
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { submitLeave, loading };
// };


import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Dynamically determine BASE_URL based on current hostname
// Relative URL for Nginx proxy
const getBaseUrl = () => {
  return '';
};

const BASE_URL = getBaseUrl();

export const useLeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all leave requests for logged-in employee
  const getMyLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/employee/my-leave-requests`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Fetch Leave Requests Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit new leave request
  const submitLeave = async (formData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/employee/leave-requests`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      toast.success(response.data.message || "Leave request submitted successfully!");
      // 🔁 Refresh leave list after submission
      await getMyLeaveRequests();
      return response.data;
    } catch (error) {
      console.error("Leave Submit Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit leave");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-fetch leave requests on mount
  useEffect(() => {
    getMyLeaveRequests();
  }, []);

  return { leaveRequests, submitLeave, getMyLeaveRequests, loading };
};
