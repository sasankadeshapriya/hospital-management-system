import { useState } from 'react';
import doctorIcon from '../../assets/icons/doctor-icon.svg';
import patientIcon from '../../assets/icons/patient-icon.svg';
import appointmentIcon from '../../assets/icons/appointments-icon.svg';
import revenueIcon from '../../assets/icons/revenue-icon.svg';
import StatsCard from '../../components/widgets/StatsCard';
import GenderDistributionChart from '../../components/widgets/GenderDistributionChart';
import DepartmentDistribution from '../../components/widgets/DepartmentDistribution';
import Notification from '../../components/Notification';
import { Bell } from 'lucide-react';
import useClickOutside from '../../hooks/useClickOutside'; // Import the custom hook

const patientData = [
  { name: 'Jan', male: 65, female: 85 },
  { name: 'Feb', male: 59, female: 62 },
  { name: 'Mar', male: 80, female: 71 },
  { name: 'Apr', male: 81, female: 56 },
  { name: 'May', male: 56, female: 55 },
  { name: 'Jun', male: 55, female: 60 },
  { name: 'Jul', male: 40, female: 60 },
  { name: 'Aug', male: 45, female: 70 },
  { name: 'Sep', male: 65, female: 75 },
  { name: 'Oct', male: 70, female: 80 },
  { name: 'Nov', male: 75, female: 85 },
  { name: 'Dec', male: 80, female: 90 },
];

const departmentData = [
  { name: 'Gynecology', percentage: 30 },
  { name: 'Cardiology', percentage: 25 },
  { name: 'Pulmonology', percentage: 20 },
  { name: 'Dentistry', percentage: 25 },
];

function DashboardPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useClickOutside(() => setShowNotifications(false)); // Use the hook

  // Demo notifications
  const notifications = [
    "New appointment scheduled for Dr. Smith.",
    "Patient feedback received: 'Excellent service!'",
    "System maintenance scheduled for tonight at 11 PM.",
    "Dr. Johnson has added a new procedure.",
    "Reminder: Staff meeting on Friday at 10 AM.",
  ];

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, John</p>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-sm text-gray-500">john.doe@gmail.com</p>
            </div>
            {/* Notification Button */}
            <button 
              type="button" 
              className="relative p-2 rounded-lg hover:bg-gray-100" 
              aria-label="Notifications" 
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {showNotifications && (
          <div ref={notificationRef}> {/* Attach the ref to the notification container */}
            <Notification notifications={notifications} onClose={() => setShowNotifications(false)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard title="Doctors" value="54" iconSrc={doctorIcon} />
          <StatsCard title="Patients" value="541" iconSrc={patientIcon} />
          <StatsCard title="Appointments" value="54" iconSrc={appointmentIcon} />
          <StatsCard title="Revenue" value="$ 150K" iconSrc={revenueIcon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GenderDistributionChart patientData={patientData} />
          </div>
          <div className="lg:col-span-1">
            <DepartmentDistribution departmentData={departmentData} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
