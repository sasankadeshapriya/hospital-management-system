import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Calendar } from '../../components/widgets/Calendar';
import { TimeSlotGrid } from '../../components/widgets/TimeSlotGrid';
import { SearchableSelect } from '../../components/SearchableSelect';
import DoctorService, { Doctor } from '../../services/DoctorService';
import PatientService, { Patient } from '../../services/PatientService';
import AppointmentService from '../../services/AppointmentService';
import { ToastContext } from '../../context/ToastContext';

const appointmentTypes = ['Consultation', 'Follow-up', 'Emergency'];

const AppointmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);

  const { state } = useLocation();
  const { doctorId } = state || {}; // Getting doctorId from the state passed via navigate
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Consultation');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [doctorDetails, setDoctorDetails] = useState<Doctor | null>(null);
  const [doctorAvailability, setDoctorAvailability] = useState<any[]>([]);

  // Fetch doctors and patients
  const fetchData = useCallback(async () => {
    try {
      const [doctorsData, patientsData] = await Promise.all([
        DoctorService.fetchDoctors(),
        PatientService.fetchPatients(),
      ]);
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      error('Failed to fetch data');
    }
  }, [error]);

  useEffect(() => {
    if (doctorId) {
      const fetchDoctorDetails = async () => {
        try {
          const doctorData = await DoctorService.fetchDoctorById(doctorId);
          setDoctorDetails(doctorData);
          setSelectedDoctor(doctorId.toString()); // Set the selected doctor
        } catch (err) {
          console.error('Error fetching doctor details:', err);
          error('Failed to fetch doctor details');
        }
      };
      fetchDoctorDetails();
    }

    fetchData();
  }, [doctorId, fetchData, error]);

  const selectedDoctorData = doctorDetails || doctors.find(
    (doctor) => doctor.DoctorID.toString() === selectedDoctor
  );

// Fetch doctor availability when doctor selection changes
useEffect(() => {
  if (!selectedDoctorData) return;

  const fetchAvailability = async () => {
    try {
      const availability = await DoctorService.fetchDoctorAvailability(selectedDoctorData.DoctorID);

      // Log the availability to inspect its structure
      console.log('Doctor availability response:', availability);

      // Ensure the availability is an array
      if (Array.isArray(availability) && availability.length > 0) {
        setDoctorAvailability(availability); // Set availability data
        setAvailableDates(generateAvailableDates(availability)); // Generate available dates
      } else {
        // Handle the case where availability is not in the expected array format
        console.error('Doctor availability data is not in the expected format');
        setDoctorAvailability([]);
        setAvailableDates([]);
      }
    } catch (err) {
      console.error('Error fetching doctor availability:', err);
      error('Failed to fetch doctor availability');
    }
  };

  fetchAvailability();
}, [selectedDoctor, selectedDoctorData, error]);

// Helper function to generate available dates based on doctor's availability
const generateAvailableDates = (availability: any[]): string[] => {
  const daysOfWeek = availability.map((slot) => slot['Available Day'].toLowerCase());
  const dates = [];
  const today = new Date();
  const daysToCheck = 30;

  for (let i = 0; i < daysToCheck; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    date.setHours(0, 0, 0, 0);  // Normalize time

    const dayName = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

    if (daysOfWeek.includes(dayName)) {
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
  }

  return dates;
};


 // Fetch available time slots when a date is selected
useEffect(() => {
  if (!selectedDate || !doctorAvailability.length) return;

  const fetchAvailableTimeSlots = () => {
    const dayName = selectedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const availableSlotsForDay = doctorAvailability.filter(
      (slot) => slot['Available Day'].toLowerCase() === dayName
    );

    let timeSlots: string[] = [];
    availableSlotsForDay.forEach((slot) => {
      const { 'Start Time': startTime, 'End Time': endTime } = slot;
      
      // Combine start time and end time into one time slot
      timeSlots.push(`${startTime} - ${endTime}`);
    });

    setAvailableTimeSlots(timeSlots);
    setSelectedTime('');  // Reset selected time
  };

  fetchAvailableTimeSlots();
}, [selectedDate, doctorAvailability]);

  // Helper function to generate time slots
  const generateTimeSlots = (start: string, end: string, interval: number): string[] => {
    const slots = [];
    const startTime = parseTime(start);
    const endTime = parseTime(end);
    const currentTime = new Date(startTime);

    while (currentTime < endTime) {
      slots.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return slots;
  };

  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5); // HH:MM
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedDate || !selectedTime) return; // Ensure that a date and time are selected
  //   console.log(selectedDate)
  //   console.log(selectedDate.toISOString().split('T')[0])
  
  //   const appointment = {
  //     AppointmentDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
  //     AppointmentTime: selectedTime,
  //     Status: 'Pending',
  //     PatientID: parseInt(selectedPatient),
  //     DoctorID: parseInt(selectedDoctor),
  //     AppointmentType: appointmentType,
  //     AvailabilityID: doctorAvailability.find(
  //       (slot) => `${slot['Start Time']} - ${slot['End Time']}` === selectedTime
  //     )?.AvailabilityID, // Find the correct AvailabilityID based on the selected time
  //   };
  
  //   try {
  //     await AppointmentService.createAppointment(appointment);
  //     success('Appointment booked successfully!');
  //     navigate('/appointments');
  //   } catch (err) {
  //     console.error('Error creating appointment:', err);
  //     error('Failed to create appointment');
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return; // Ensure that a date and time are selected

    console.log("Original Selected Date: ", selectedDate);

    // Adjust the date to remove the timezone offset
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()); // Adjust for timezone offset

    // Format as YYYY-MM-DD
    const formattedDate = adjustedDate.toISOString().split('T')[0]; 

    console.log("Formatted Date (after timezone adjustment): ", formattedDate);

    const appointment = {
      AppointmentDate: formattedDate, // Use the manually adjusted and formatted date
      AppointmentTime: selectedTime,
      Status: 'Pending',
      PatientID: parseInt(selectedPatient),
      DoctorID: parseInt(selectedDoctor),
      AppointmentType: appointmentType,
      AvailabilityID: doctorAvailability.find(
        (slot) => `${slot['Start Time']} - ${slot['End Time']}` === selectedTime
      )?.AvailabilityID, // Find the correct AvailabilityID based on the selected time
    };

    try {
      await AppointmentService.createAppointment(appointment);
      success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      console.error('Error creating appointment:', err);
      error('Failed to create appointment');
    }
};

  

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Book New Appointment</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              {doctorDetails ? (
                <div className="text-gray-700">{doctorDetails.Name} - {doctorDetails.Specialization}</div>
              ) : (
                <SearchableSelect
                  options={doctors.map((doctor) => ({
                    id: doctor.DoctorID,
                    label: `${doctor.Name} - ${doctor.Specialization}`,
                  }))}
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  placeholder="Select Doctor"
                  label="Doctor"
                />
              )}
            </div>

            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
              <SearchableSelect
                options={patients.map((patient) => ({
                  id: patient.PatientID,
                  label: `${patient.FirstName} ${patient.LastName}`,
                }))}
                value={selectedPatient}
                onChange={setSelectedPatient}
                placeholder="Select Patient"
                label="Patient"
              />
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
              <select
                required
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Select Appointment Type"
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-6">
            {selectedDoctor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  highlightedDates={availableDates}
                  disableUnavailableDates
                />
              </div>
            )}

            {selectedDate && availableTimeSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <TimeSlotGrid
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  availableSlots={availableTimeSlots}
                />
              </div>
            )}
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !selectedDoctor || !selectedPatient || !selectedDate || !selectedTime
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentFormPage;