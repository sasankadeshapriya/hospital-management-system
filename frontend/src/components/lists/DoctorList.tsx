import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BookAppointmentModal from '../modal/BookAppointmentModal';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  duration: string;
  patients: number;
  availability: string;
  image: string;
}

interface DoctorListProps {
  specialtyFilter: string;
  searchQuery: string;
  onSelect: (selectedIds: number[]) => void;
}

interface AppointmentData {
  patientName: string;
  doctorId: number;
  date: string;
  time: string;
  type: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiology',
    duration: '10 years',
    patients: 1500,
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Dr. James Mitchell',
    specialty: 'Neurology',
    duration: '12 years',
    patients: 1200,
    availability: 'In Surgery',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  // More doctor entries...
];

const DoctorList: React.FC<DoctorListProps> = ({ specialtyFilter, searchQuery, onSelect }) => {
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null); // Update the type here
  const navigate = useNavigate();

  const handleSelectDoctor = (id: number) => {
    const updatedSelectedDoctors = selectedDoctors.includes(id)
      ? selectedDoctors.filter((doctorId) => doctorId !== id)
      : [...selectedDoctors, id];
    setSelectedDoctors(updatedSelectedDoctors);
    onSelect(updatedSelectedDoctors);
  };

  const handleViewProfile = (id: number) => navigate(`/doctors/${id}`);

  const handleBookAppointment = (doctor: Doctor) => {
    const newAppointmentData: AppointmentData = {
      patientName: 'John Doe',
      doctorId: doctor.id,
      date: '',
      time: '',
      type: doctor.specialty,
    };
    setAppointmentData(newAppointmentData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentData(null);
  };

  const getAvailabilityClass = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'In Surgery':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = specialtyFilter === 'All Doctors' || doctor.specialty === specialtyFilter;
    const matchesSearchQuery = [doctor.name, doctor.specialty, doctor.duration, doctor.availability]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpecialty && matchesSearchQuery;
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-sm p-6 relative">
            <input
              type="checkbox"
              checked={selectedDoctors.includes(doctor.id)}
              onChange={() => handleSelectDoctor(doctor.id)}
              className="absolute top-4 left-4 w-4 h-4"
              aria-label={`Select ${doctor.name}`}
            />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
              </div>
              <span className={`px-3 py-1 mt-4 rounded-full text-xs font-medium ${getAvailabilityClass(doctor.availability)}`}>
                {doctor.availability}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Duration at Hospital</span>
                <span className="font-medium text-gray-900">{doctor.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Patients</span>
                <span className="font-medium text-gray-900">{doctor.patients}+</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between space-x-2">
              <button
                onClick={() => handleViewProfile(doctor.id)}
                className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors w-full"
              >
                View Profile
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
      {/* Render doctors and other logic */}
      {isModalOpen && (
        <BookAppointmentModal
          onClose={closeModal}
          appointmentData={appointmentData}
        />
      )}
    </div>
    </div>
  );
};

export default DoctorList;
