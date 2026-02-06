import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://hospital-backend-yc8f.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),

  // Email verification endpoints
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (data) => api.post("/auth/resend-verification", data),

  // NEW: OTP-based password reset endpoints
  requestPasswordResetOTP: (data) =>
    api.post("/auth/forgot-password-otp", data),
  resetPasswordWithOTP: (data) => api.post("/auth/reset-password-otp", data),

  // Legacy: Token-based password reset endpoints
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    api.post(`/auth/reset-password/${token}`, data),
};

// Doctor APIs
export const doctorAPI = {
  getAll: (params) => api.get("/doctors", { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  add: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  getAppointments: (id, params) =>
    api.get(`/doctors/${id}/appointments`, { params }),
  getProfile: () => api.get("/doctor/profile"),
  updateProfile: (data) => api.post("/doctor/profile", data),
};

// Patient APIs
export const patientAPI = {
  getAll: (params) => api.get("/patients", { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  addMedicalHistory: (id, data) =>
    api.post(`/patients/${id}/medical-history`, data),
  getAppointments: (id, params) =>
    api.get(`/patients/${id}/appointments`, { params }),
  getMedicalHistory: (id) => api.get(`/patients/${id}/medical-history`),
  getProfile: () => api.get("/patient/profile"),
  updateProfile: (data) => api.post("/patient/profile", data),
};

// Appointment APIs
export const appointmentAPI = {
  book: (data) => api.post("/appointments", data),
  getAll: (params) => api.get("/appointments", { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  addDiagnosis: (id, data) => api.put(`/appointments/${id}/diagnosis`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export default api;
