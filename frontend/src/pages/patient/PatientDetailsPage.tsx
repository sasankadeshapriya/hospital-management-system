// src/pages/patient/PatientDetailsPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientService from '../../services/PatientService';
import AppointmentService, { Appointment } from '../../services/AppointmentService';
import MedicalHistoryService, { MedicalHistory } from '../../services/MedicalHistoryService';
import { ToastContext } from '../../context/ToastContext';

interface Patient {
  PatientID: number;
  FirstName: string;
  LastName: string;
  DOB: string;
  Gender: string;
  ContactNumber: string;
  Address: string;
  CNIC: string;
  isActive: number | boolean;
}

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get patient ID from URL
  const navigate = useNavigate();
  const { error } = useContext(ToastContext);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          const patientData = await PatientService.fetchPatientById(Number(id));
          setPatient(patientData);
        } catch (err) {
          error('Failed to load patient details');
          console.error('Error loading patient:', err);
        }
      }
    };
    loadPatient();
  }, [id, error]);

  useEffect(() => {
    const loadMedicalHistory = async () => {
      if (id) {
        try {
          const medicalHistoryData = await MedicalHistoryService.fetchMedicalHistoryByPatientId(Number(id));
          setMedicalHistory(medicalHistoryData);
        } catch (err) {
          console.error('Error loading medical history:', err);
        }
      }
    };
    loadMedicalHistory();
  }, [id]);

  useEffect(() => {
    const loadAppointment = async () => {
      if (id) {
        try {
          const appointmentData = await AppointmentService.fetchAppointmentsByPatientId(Number(id));
          setAppointment(appointmentData);
        } catch (err) {
          console.error('Error loading appointment:', err);
        }
      }
    };
    loadAppointment();
  }, [id]);

  if (!patient) {
    return <p>Loading...</p>;
  }

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    return monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-indigo-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Patients
          </button>
          <span>/</span>
          <span>Patient Record - {patient.FirstName} {patient.LastName}</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Record <span className="text-gray-400">- {patient.FirstName} {patient.LastName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                {/* Circle with initials */}
                <div className="h-20 w-20 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xl font-semibold">
                  {patient.FirstName[0]}
                  {patient.LastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {patient.FirstName} {patient.LastName}
                  </h2>
                  <p className="text-gray-500">Patient ID: #{patient.PatientID}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Age:</span>
                  <span className="font-medium text-gray-900">{calculateAge(patient.DOB)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium text-gray-900">{patient.Gender === 'M' ? 'Male' : 'Female'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Telephone:</span>
                  <span className="font-medium text-gray-900">{patient.ContactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-gray-900">{patient.Address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NIC:</span>
                  <span className="font-medium text-gray-900">{patient.CNIC}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Information</h3>
              <div className="space-y-4">
                {appointment ? (
                  [
                    { label: 'Doctor', value: appointment['Doctor Name'] },
                    { label: 'Type', value: appointment.AppointmentType },
                    { label: 'Status', value: appointment.Status },
                    { label: 'Room No', value: appointment.RoomNO.toString() },
                    { label: 'Queue ID', value: appointment.QueueID.toString() },
                    { label: 'Queue No', value: appointment.QueueNumber.toString() },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-500">{item.label}:</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No appointment details available.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-gray-900 font-medium mt-6 mb-3">Medical History:</h4>
              <div className="space-y-4">
                {medicalHistory ? (
                  [
                    { label: 'Diagnosis', value: medicalHistory.Diagnosis },
                    { label: 'Treatment History', value: medicalHistory.TreatmentHistory },
                    { label: 'Allergies', value: medicalHistory.Allergies },
                    { label: 'Previous Surgeries', value: medicalHistory.PreviousSurgeries },
                    { label: 'Family History', value: medicalHistory.FamilyHistory },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-500">{item.label}:</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No medical history available.</p>
                )}
            </div>

            {/* Conditional Button Rendering */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => navigate(medicalHistory ? `/medical-history/edit/${id}` : `/medical-history/add/${id}`)}
                className={`px-4 py-2 ${medicalHistory ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 focus:ring-yellow-500' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              >
                {medicalHistory ? 'Update' : 'Add'}
              </button>
            </div>
          </div>

            {appointment && (
              <div className="mt-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                  <div className="flex items-center gap-6 p-4 bg-indigo-50 rounded-lg">
                    <div>
                      <p className="text-sm text-indigo-600">{new Date(appointment.AppointmentDate).getFullYear()}</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {new Date(appointment.AppointmentDate).toLocaleString('en-US', { month: 'long' })}
                      </p>
                      <p className="text-4xl font-bold text-indigo-600">
                        {new Date(appointment.AppointmentDate).getDate()}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900">{appointment.AppointmentType}</h4>
                      <p className="text-gray-600">{appointment.AppointmentTime}</p>
                      <p className="text-gray-500 mt-2">Conducted by: {appointment['Doctor Name']}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PatientDetailsPage;
