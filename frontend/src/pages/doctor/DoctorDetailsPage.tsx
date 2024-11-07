import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DoctorService, { Doctor } from '../../services/DoctorService';
import AppointmentService from '../../services/AppointmentService';
import { Calendar, Clock, MapPin, DollarSign, ChevronLeft } from 'lucide-react';
import ConfirmationModal from '../../components/modal/ConfirmationModal';

interface Appointment {
  AppointmentID: number;
  AppointmentDate: string;
  AppointmentTime: string;
  PatientName: string;
  AppointmentType: string;
  Status: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: React.ElementType;
  color?: string;
}

interface AvailabilitySchedule {
  AvailableDay: string;
  StartTime: string;
  EndTime: string;
  RoomNO: string;
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const fetchDoctorDetails = useCallback(async (doctorId: number) => {
    try {
      const doctorData = await DoctorService.fetchDoctorById(doctorId);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
    }
  }, []);

  const fetchAppointments = useCallback(async (doctorId: number) => {
    try {
      const appointmentsData = await AppointmentService.fetchAppointmentsByDoctorId(doctorId);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const doctorId = Number(id);
      fetchDoctorDetails(doctorId);
      fetchAppointments(doctorId);
    }
  }, [id, fetchDoctorDetails, fetchAppointments]);

  useEffect(() => {
    if (appointments.length) {
      const today = new Date().setHours(0, 0, 0, 0);
      const filteredAppointments = appointments.filter(appointment => 
        new Date(appointment.AppointmentDate).setHours(0, 0, 0, 0) === today
      );
      setTodaysAppointments(filteredAppointments);
    }
  }, [appointments]);

  const todaysAppointmentCount = todaysAppointments.length;

  const handleUpdate = () => {
    if (doctor) {
      navigate(`/doctors/update/${doctor.DoctorID}/${doctor.UserID}`); // Pass UserID to the update page
    }
  };

  const handleModalConfirm = async () => {
    try {
      if (doctor) {
        await DoctorService.deleteDoctor(doctor.UserID); // Use userId
        navigate('/doctors');
      }
    } catch (error) {
      console.error('Failed to delete doctor:', error);
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const AvailabilityScheduleComponent = ({ availability }: { availability: AvailabilitySchedule[] }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        {availability.length > 0 ? (
          availability.map((schedule) => (
            <div key={schedule.RoomNO} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{schedule.AvailableDay}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {schedule.StartTime} - {schedule.EndTime}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <MapPin className="h-4 w-4 inline mr-1" />
                Room {schedule.RoomNO}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No schedule available</p>
        )}
      </div>
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const statusClass = appointment.Status === 'Completed' 
      ? 'bg-green-100 text-green-800'
      : appointment.Status === 'In Progress'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';
      
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium text-gray-900">{appointment.AppointmentTime}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">{appointment.PatientName}</p>
            <p className="text-sm text-gray-500">{appointment.AppointmentType}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {appointment.Status}
        </span>
      </div>
    );
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-indigo-600">
            <ChevronLeft className="h-4 w-4" />
            Back to Doctors
          </button>
          <span>/</span>
          <span>Doctor Profile - {doctor.Name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <img src={doctor.Photo} alt={doctor.Name} className="h-32 w-32 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">{doctor.Name}</h2>
                <p className="text-indigo-600">{doctor.Specialization}</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Employee ID:</span>
                  <span className="font-medium text-gray-900">#D-{doctor.DoctorID}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Join Date:</span>
                  <span className="font-medium text-gray-900">
                    {doctor['Date of join'] ? new Date(doctor['Date of join']).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">{doctor.Email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">{doctor.ContactNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-gray-900">{doctor.Address || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor['Employeement Status'] === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {doctor['Employeement Status'] || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-10 justify-end">
                <button onClick={handleUpdate} className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200">
                  Update
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
            <AvailabilityScheduleComponent availability={doctor.Availability || []} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard title="Today's Appointments" value={todaysAppointmentCount || 'No appointments'} Icon={Calendar} color="bg-pink-500" />
              <StatsCard title="Total Revenue" value="$15,000" Icon={DollarSign} color="bg-green-500" />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
              <div className="space-y-4">
                {todaysAppointments.length > 0
                  ? todaysAppointments.map((appointment) => <AppointmentCard key={appointment.AppointmentID} appointment={appointment} />)
                  : <p className="text-center text-gray-500">No appointments today</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal 
          message="Are you sure you want to delete this doctor?"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </main>
  );
}

export default DoctorDetailsPage;
