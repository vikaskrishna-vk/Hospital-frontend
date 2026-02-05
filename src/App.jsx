import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Authentication pages
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPasswordOTP from "./pages/ForgotPasswordOTP"; // NEW: OTP-based forgot password
import ForgotPassword from "./pages/ForgotPassword"; // Legacy token-based
import ResetPassword from "./pages/ResetPassword"; // Legacy token-based
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";

/**
 * Main App Component with Routing
 * UPDATED: Added OTP-based forgot password route
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Email Verification Routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* NEW: OTP-Based Password Reset Route */}
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />

        {/* Legacy: Token-Based Password Reset Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Google OAuth Success Route */}
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Doctor */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Patient */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route - redirects to home if not authenticated */}
        <Route path="/" element={<Home />} />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
