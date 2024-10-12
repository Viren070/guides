import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastTypeColorMapping = {
  info: [
    ["--toastify-color-info", "#eef9fd", "#193c47"],
    ["--toastify-text-color-info", "#193c47", "#eef9fd"]
  ],
  error: [
    ["--toastify-color-error", "#ffebec", "#4b1113"],
    ["--toastify-text-color-error", "#4b1113", "#ffebec"]
  ],
  success: [
    ["--toastify-color-success", "#e6f6e6", "#003100"],
    ["--toastify-text-color-success", "#003100", "#e6f6e6"]
  ],
};

export const createToast = (message: string, type: 'info' | 'error' | 'success', colorMode: 'light' | 'dark', toastId: string) => {
  const mappings = toastTypeColorMapping[type];

  // Set the CSS variables dynamically
  mappings.forEach(([cssVariable, lightValue, darkValue]) => {
    const value = colorMode === 'light' ? lightValue : darkValue;
    document.documentElement.style.setProperty(cssVariable, value);
  });

  toast[type](message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    closeButton: false,
    draggable: "touch",
    draggablePercent: 30,
    progress: undefined,
    theme: "colored",
    toastId: toastId,
    transition: Slide,
  });
};