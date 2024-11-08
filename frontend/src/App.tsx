import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/main/DashboardPage';
import DoctorsPage from './pages/doctor/DoctorsPage';
import DoctorDetails from './pages/doctor/DoctorDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import PatientsPage from './pages/patient/PatientsPage';
import PatientDetails from './pages/patient/PatientDetailsPage';
import { PatientFormPage } from './pages/patient/PatientFormPage';
import { DoctorFormPage } from './pages/doctor/DoctorFormPage';
import UpdateDoctorFormPage from './pages/doctor/UpdateDoctorForm';
import DoctorAppointmentsPage from './pages/appointment/DoctorAppointmentsPage';
import AppointmentFormPage from './pages/appointment/AppointmentFormPage';
import InventoryPage from './pages/inventory/InventoryPage';
import { InventoryFormPage } from './pages/inventory/InventoryFormPage';
import StaffPage from './pages/staff/StaffPage';
import { StaffFormPage } from './pages/staff/StaffFormPage';
import UpdateStaffFormPage from './pages/staff/UpdateStaffFormPage';
import DepartmentsPage from './pages/department/DepartmentsPage';
import DepartmentFormPage from './pages/department/DepartmentFormPage'
import DepartmentUpdateFormPage from './pages/department/DepartmentFormPage';
import LabTestsPage from './pages/lab/LabTestsPage';
import LabTestFormPage from './pages/lab/LabTestFormPage';
import MedicalHistoryFormPage from './pages/medical-history/MedicalHistoryFormPage';
import AddAvailabilityPage from './pages/availability/AddAvailabilityPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/add" element={<DoctorFormPage />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/doctors/update/:doctorId/:userId" element={<UpdateDoctorFormPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<PatientFormPage />} />
            <Route path="/patients/edit/:id" element={<PatientFormPage />} />
            <Route path="/patient-details/:id" element={<PatientDetails />} />
            <Route path="/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/appointments/new" element={<AppointmentFormPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/staff/new" element={<StaffFormPage />} />
            <Route path="/staff/edit/:userId" element={<UpdateStaffFormPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/new" element={<InventoryFormPage />} />
            <Route path="/inventory/edit/:itemId" element={<InventoryFormPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/add" element={<DepartmentFormPage />} />
            <Route path="/departments/edit/:departmentId" element={<DepartmentUpdateFormPage />} />
            <Route path="/labtests" element={<LabTestsPage />} />
            <Route path="/labtests/new" element={<LabTestFormPage />} />
            <Route path="/labtests/edit/:id" element={<LabTestFormPage />} />
            <Route path="/medical-history/add/:id" element={<MedicalHistoryFormPage />} />
            <Route path="/medical-history/edit/:id" element={<MedicalHistoryFormPage />} />
            <Route path="/availability/add/:doctorId" element={<AddAvailabilityPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
