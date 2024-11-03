import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, UserRound, Calendar, Users2, LogOut, ChevronRight, Pill } from 'lucide-react';
import logofull from '../assets/images/logo-light.svg';
import logohalf from '../assets/images/logo-head-light.svg';
import '../style/Sidebar.css';

interface SidebarProps {
  onLogout: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  value: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', value: '/' },
    { icon: UserRound, label: 'Doctors', value: '/doctors' },
    { icon: Users, label: 'Patients', value: '/patients' },
    { icon: Calendar, label: 'Appointments', value: '/appointments' },
    { icon: Users2, label: 'Staff', value: '/staff' },
    { icon: Pill, label: 'Inventory', value: '/inventory' },
  ];

  const handleResize = () => {
    setIsExpanded(window.innerWidth > 768);
  };

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setting based on window size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'compressed'} bg-indigo-600 text-white flex flex-col`}>
      <div className="flex items-center justify-center mb-12 mt-4">
        <img src={isExpanded ? logofull : logohalf} alt="Logo" className="h-10 w-auto rounded-lg" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.value} className={({ isActive }) =>
                `nav-link w-full px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`
              }>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={toggleSidebar} className="toggle-button flex items-center justify-center" title="Toggle Sidebar">
        <ChevronRight className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white transition-colors mb-8">
        {isExpanded ? <><LogOut className="h-5 w-5" /><span>Log out</span></> : <LogOut className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default Sidebar;
