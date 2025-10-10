// import { useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";

// export const useEmployeeProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axiosInstance.get("/employee/profile");
//         setProfile(res.data);
//         console.log(res.data);
        
//       } catch (error) {
//         console.error("Error fetching employee profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return { profile, loading, setProfile };
// };

// export const addNewEmployee = (formData) => {
//   try{

//   }catch(error){

//   }
// }


import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

// ✅ Hook to fetch employee profile
export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/employee/profile");
        setProfile(res.data);
        console.log("Fetched profile:", res.data);
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, setProfile };
};

// ✅ Utility to add a new employee
export const addNewEmployee = async (formData) => {
  try {
    const res = await axiosInstance.post("/admin/employees", formData,{
      headers:{
        Authorization: localStorage.getItem('token')
      }
    });
    toast.success(res.data.message || "Employee created successfully");
    return res.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    toast.error(error.response?.data?.message || "Failed to create employee");
    throw error;
  }
};
