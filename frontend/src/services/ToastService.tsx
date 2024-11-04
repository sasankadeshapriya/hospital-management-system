import { toast, ToastOptions } from 'react-toastify';

class ToastService {
  private static defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  static success(message: string, options?: ToastOptions) {
    toast.success(message, { ...ToastService.defaultOptions, ...options });
  }

  static error(message: string, options?: ToastOptions) {
    toast.error(message, { ...ToastService.defaultOptions, ...options });
  }
}

export default ToastService;
