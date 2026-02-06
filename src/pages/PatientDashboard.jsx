import React, { useState, useEffect } from "react";
import { appointmentAPI, patientAPI } from "../services/api";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch patient profile
        const profileResponse = await patientAPI.getProfile();
        const patientData = profileResponse.data.data;
        setProfile({
          name: patientData.userId.name,
          email: patientData.userId.email,
          phone: patientData.phone || "N/A",
          age: patientData.age || "N/A",
          gender: patientData.gender || "N/A",
        });

        // Fetch appointments
        const appointmentsResponse = await appointmentAPI.getAll();
        const appointmentsList = appointmentsResponse.data.data;
        setAppointments(appointmentsList);
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Patient Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {error && (
              <div className="px-4 py-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Profile Summary */}
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Profile Information
                  </h3>
                  {loading ? (
                    <div className="mt-5 text-gray-500">Loading profile...</div>
                  ) : profile ? (
                    <>
                      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Phone
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.phone}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Age & Gender
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.age} years, {profile.gender}
                          </dd>
                        </div>
                      </div>
                      <div className="mt-5">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          Edit Profile
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 text-gray-500">
                      No profile data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    My Appointments
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Your upcoming and past appointments
                  </p>
                </div>
                {loading ? (
                  <div className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    Loading appointments...
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    No appointments scheduled
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <li key={appointment._id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {appointment.doctorId.userId.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.doctorId.userId.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.doctorId.specialization} •{" "}
                                  {appointment.appointmentDate} at{" "}
                                  {appointment.startTime}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.type}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-3 ${
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                              <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 h-12">
                  Book Appointment
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 h-12">
                  View Medical Records
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 h-12">
                  Prescription History
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 h-12">
                  Health Tips
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
