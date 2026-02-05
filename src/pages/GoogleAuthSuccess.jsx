import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Google Auth Success Handler Component (NEW)
 * This page receives the JWT token from Google OAuth and stores it
 */
const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store the token
      localStorage.setItem("token", token);

      // Fetch user data and redirect to appropriate dashboard
      fetchUserAndRedirect(token);
    } else {
      // If no token, redirect to login with error
      navigate("/login?error=google_auth_failed");
    }
  }, [searchParams, navigate]);

  const fetchUserAndRedirect = async (token) => {
    try {
      const response = await fetch(
        "https://hospital-backend-yc8f.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const user = data.data.user;

        // Store user data
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate based on role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      } else {
        navigate("/login?error=failed_to_fetch_user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/login?error=authentication_error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Completing Sign In...
        </h2>
        <p className="text-gray-600">
          Please wait while we log you in with Google.
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
