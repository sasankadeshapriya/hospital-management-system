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
import DoctorAppointmentsPage from './pages/appointment/DoctorAppointmentsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import { InventoryFormPage } from './pages/inventory/InventoryFormPage';
import StaffPage from './pages/staff/StaffPage';
import { StaffFormPage } from './pages/staff/StaffFormPage';
import DepartmentsPage from './pages/department/DepartmentsPage';
import LabTestsPage from './pages/lab/LabTestsPage';
import LabTestFormPage from './pages/lab/LabTestFormPage';

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
            <Route path="/doctors/update/:doctorId" element={<DoctorFormPage />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<PatientFormPage />} />
            <Route path="/patients/edit/:id" element={<PatientFormPage />} />
            <Route path="/patient-details/:id" element={<PatientDetails />} />
            <Route path="/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/staff/new" element={<StaffFormPage />} />
            <Route path="/staff/edit/:id" element={<StaffFormPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/new" element={<InventoryFormPage />} />
            <Route path="/inventory/edit/:itemId" element={<InventoryFormPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/labtests" element={<LabTestsPage />} />
            <Route path="/labtests/new" element={<LabTestFormPage />} />
            <Route path="/labtests/edit/:id" element={<LabTestFormPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
