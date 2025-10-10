import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/employee/profile");
        setProfile(res.data);
        console.log(res.data);
        
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
