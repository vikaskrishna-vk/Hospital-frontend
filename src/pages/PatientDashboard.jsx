import React, { useState, useEffect } from "react";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    age: 30,
    gender: "Male",
  });

  useEffect(() => {
    // TODO: Fetch patient's appointments and profile from API
    // Mock data for now
    setAppointments([
      {
        id: 1,
        doctorName: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        date: "2024-02-15",
        time: "10:00 AM",
        status: "confirmed",
        type: "Consultation",
      },
      {
        id: 2,
        doctorName: "Dr. Michael Chen",
        specialty: "Dermatology",
        date: "2024-02-20",
        time: "02:30 PM",
        status: "pending",
        type: "Follow-up",
      },
      {
        id: 3,
        doctorName: "Dr. Emily Davis",
        specialty: "General Medicine",
        date: "2024-02-10",
        time: "09:15 AM",
        status: "completed",
        type: "Check-up",
      },
    ]);
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
            {/* Profile Summary */}
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Profile Information
                  </h3>
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
                <ul className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <li key={appointment.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {appointment.doctorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.doctorName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.specialty} • {appointment.date} at{" "}
                                {appointment.time}
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
