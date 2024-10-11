import { toast, Slide } from 'react-toastify';
import { useColorMode } from '@docusaurus/theme-common';

const useToast = () => {
  const { colorMode } = useColorMode();

  const showToast = (message: string, type: 'info' | 'error' = 'info') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: colorMode,
      transition: Slide,
    });
  };

  return showToast;
};

export default useToast;