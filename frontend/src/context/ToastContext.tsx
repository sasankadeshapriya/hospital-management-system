import React, { createContext, useContext } from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define options for the toast notifications
const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Create the ToastContext
export const ToastContext = createContext<{
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
}>({
  success: () => {},
  error: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultToastOptions, ...options });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultToastOptions, ...options });
  };

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => useContext(ToastContext);
