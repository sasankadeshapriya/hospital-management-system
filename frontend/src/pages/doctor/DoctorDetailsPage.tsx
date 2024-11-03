import React from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, ChevronLeft} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: React.ElementType;
  color?: string;
}

function StatsCard({ title, value, Icon, color = 'bg-indigo-600' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Today</span>
        <div className={`${color} p-2 rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <h3 className="text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DoctorDetailsPage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-1 hover:text-indigo-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Doctors
          </button>
          <span>/</span>
          <span>Doctor Profile - Dr. Sarah Wilson</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Dr. Sarah Wilson"
                  className="h-32 w-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-900">Dr. Sarah Wilson</h2>
                <p className="text-indigo-600">Cardiology Specialist</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Employee ID:</span>
                  <span className="font-medium text-gray-900">#D-0001</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Join Date:</span>
                  <span className="font-medium text-gray-900">15 Jan 2020</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">sarah.wilson@example.com</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">+1 234 567 8900</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
              <div className="space-y-4">
                {[
                  { day: 'Monday', time: '09:00 AM - 05:00 PM', room: 'Room 201' },
                  { day: 'Tuesday', time: '09:00 AM - 05:00 PM', room: 'Room 201' },
                  { day: 'Wednesday', time: '10:00 AM - 06:00 PM', room: 'Room 202' },
                  { day: 'Thursday', time: '09:00 AM - 05:00 PM', room: 'Room 201' },
                  { day: 'Friday', time: '09:00 AM - 03:00 PM', room: 'Room 203' }
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{schedule.day}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {schedule.time}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {schedule.room}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Total Patients"
                value="1.5k+"
                Icon={Users}
              />
              <StatsCard
                title="Today's Appointments"
                value="25"
                Icon={Calendar}
                color="bg-pink-500"
              />
              <StatsCard
                title="Total Revenue"
                value="$15,000"
                Icon={DollarSign}
                color="bg-green-500"
              />
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', patient: 'Rebecca Young', type: 'Consultation', status: 'Completed' },
                  { time: '10:30 AM', patient: 'John Smith', type: 'Follow-up', status: 'In Progress' },
                  { time: '11:30 AM', patient: 'Emma Davis', type: 'Consultation', status: 'Waiting' }
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DoctorDetailsPage;