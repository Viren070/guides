import { toast, Slide } from 'react-toastify';
import { useColorMode } from '@docusaurus/theme-common';

const useToast = () => {
  const { colorMode } = useColorMode();

  const showToast = (message: string, type: 'info' | 'error' = 'info', toastId: string) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: "touch",
      progress: undefined,
      theme: colorMode,
      toastId: toastId,
      transition: Slide,
    });
  };

  return showToast;
};

export default useToast;