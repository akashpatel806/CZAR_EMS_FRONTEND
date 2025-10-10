// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "../Layout/MainLayout";
// import DashboardPage from "../pages/Dashboard/DashboardPage";
// import ProfilePage from "../pages/Profile/ProfilePage";
// import LeaveRequestPage from "../pages/LeaveRequest/LeaveRequestPage";
// import HolidayCalendarPage from "../pages/HolidayCalendar/HolidayCalendarPage";
// import SettingsPage from "../pages/Settings/SettingsPage";
// import ErrorComponent from "../components/ErrorComponent";
// import Login from "../pages/Login/Login";
// import PrivateRoute from "./PrivateRoute";
// import { AuthProvider } from "../context/AuthContext";
// import { Toaster } from "react-hot-toast";

// export default function AppRoutes() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             success: {
//               style: { background: "#d1fae5", color: "#065f46" }, // green
//               iconTheme: { primary: "#059669", secondary: "#ffffff" },
//             },
//             error: {
//               style: { background: "#fee2e2", color: "#991b1b" }, // red
//               iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
//             },
//           }}
//         />
//         <Routes>
//           {/* Public Route */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Main App Routes */}
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <MainLayout />
//               </PrivateRoute>
//             }
//           >
//             <Route path="" element={<DashboardPage />} />
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="leave-request" element={<LeaveRequestPage />} />
//             <Route path="holiday-calendar" element={<HolidayCalendarPage />} />
//             <Route path="settings" element={<SettingsPage />} />
//             <Route
//               path="*"
//               element={<ErrorComponent message="Page not found" />}
//             />
//           </Route>



//           {/* Redirect everything unknown to login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LeaveRequestPage from "../pages/LeaveRequest/LeaveRequestPage";
import HolidayCalendarPage from "../pages/HolidayCalendar/HolidayCalendarPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import ErrorComponent from "../components/ErrorComponent";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

// ✅ Admin Pages
import AddEmployeePage from "../pages/Employee/AddEmployeePage";
import EmployeeListPage from "../pages/Employee/EmployeeListPage";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 🔥 Global Toast Setup */}
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: { background: "#d1fae5", color: "#065f46" },
              iconTheme: { primary: "#059669", secondary: "#ffffff" },
            },
            error: {
              style: { background: "#fee2e2", color: "#991b1b" },
              iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
            },
          }}
        />

        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* 🔒 Protected App Routes (uses MainLayout for all roles) */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* Shared Pages */}
            <Route path="" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="leave-request" element={<LeaveRequestPage />} />
            <Route path="holiday-calendar" element={<HolidayCalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* 👑 Admin-only Pages */}
            <Route
              path="admin/add-employee"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddEmployeePage />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/manage-holidays"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <HolidayCalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/all-employees"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <EmployeeListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<ErrorComponent message="Page not found" />}
            />
          </Route>

          {/* 🔁 Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
