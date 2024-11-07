// src/components/DoctorList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DoctorService, { Doctor } from '../../services/DoctorService';
import AppointmentService, { Appointment } from '../../services/AppointmentService';

interface DoctorListProps {
  specialtyFilter: string;
  searchQuery: string;
  onSelect: (selectedIds: number[]) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ specialtyFilter, searchQuery }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await DoctorService.fetchDoctors();
        console.log("Doctors Data:", doctorsData);

        // Logging keys, types, and values for each doctor object
        doctorsData.forEach((doctor, index) => {
          console.log(`Doctor ${index + 1}:`);
          Object.keys(doctor).forEach((key) => {
            console.log(`Key: ${key}, Type: ${typeof doctor[key]}, Value: ${doctor[key]}`);
          });
        });

        setDoctors(doctorsData);
      } catch (error) {
        console.error('Failed to load doctors:', error);
      }
    };

    const loadAppointments = async () => {
      try {
        const appointmentsData = await AppointmentService.fetchAppointments();
        console.log("Appointments Data:", appointmentsData);

        // Logging keys, types, and values for each appointment object
        appointmentsData.forEach((appointment, index) => {
          console.log(`Appointment ${index + 1}:`);
          Object.keys(appointment).forEach((key) => {
            console.log(`Key: ${key}, Type: ${typeof appointment[key]}, Value: ${appointment[key]}`);
          });
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to load appointments:', error);
      }
    };

    loadDoctors();
    loadAppointments();
  }, []);

  const handleViewProfile = (id: number) => navigate(`/doctors/${id}`);

  const handleBookAppointment = (doctorId: number) => {
    navigate('/appointments/new', { state: { doctorId } });
  };

  const getAvailabilityClass = (availability: string) => {
    switch (availability) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'In Surgery':
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const calculateDuration = (dateOfJoin: string): string => {
    const joinDate = new Date(dateOfJoin);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();
  
    if (months < 0 || (months === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
  
    // Set years to 0 if it's negative, indicating that the join date is in the current year
    if (years < 0) {
      years = 0;
    }
  
    return `${years} years`;
  };
  

  const getPatientCount = (doctorName: string): number => {
    const count = appointments.filter(
      (appointment) => appointment['Doctor Name'] === doctorName
    ).length;
    return count;
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      specialtyFilter === 'All Doctors' || doctor.DepartmentName === specialtyFilter;
    const matchesSearchQuery = [
      doctor.Name,
      doctor.DepartmentName,
      doctor.Specialization,
      doctor["Employment Status"],
    ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpecialty && matchesSearchQuery;
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.DoctorID} className="bg-white rounded-xl shadow-sm p-6 relative">
            {/* Removed checkbox for doctor selection */}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.Photo}
                  alt={doctor.Name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.Name}</h3>
                  <p className="text-sm text-gray-500">{doctor.DepartmentName}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 mt-4 rounded-full text-xs font-medium ${getAvailabilityClass(
                  doctor["Employment Status"]
                )}`}
              >
                {doctor["Employment Status"]}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Duration at Hospital</span>
                <span className="font-medium text-gray-900">
                  {calculateDuration(doctor["Date of Join"])}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Patients</span>
                <span className="font-medium text-gray-900">
                  {getPatientCount(doctor.Name)}+
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between space-x-2">
              <button
                onClick={() => handleViewProfile(doctor.DoctorID)}
                className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors w-full"
              >
                View Profile
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBookAppointment(doctor.DoctorID)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
