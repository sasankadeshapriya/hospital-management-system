import React from 'react';

// Define the prop types using an interface
interface NotificationProps {
  notifications: string[];
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-20 right-12 w-72 bg-white shadow-2xl rounded-md p-4 z-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button 
          onClick={onClose} 
          aria-label="Close notifications"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="p-2 border-b last:border-b-0 text-gray-700">
              {notification}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
