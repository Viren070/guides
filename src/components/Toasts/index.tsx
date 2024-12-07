import { ToastContainer, toast, Slide } from 'react-toastify';
import './styles.css';

// Singleton showToast function
export const showToast = (message: string, type: 'info' | 'error' | 'success', toastId?: string) => {
  toast(message, {
    type: type,
    toastId: toastId,
    className: `wideToast`,
  });
};

export function MyToastContainer(): JSX.Element {
  return (
    <ToastContainer
      stacked
      position="top-center"
      autoClose={3500}
      hideProgressBar
      draggablePercent={60}
      draggableDirection='y'
      draggable="touch"
      limit={10}
      theme="colored"
      transition={Slide}
      className="wideToastContainer"
      closeButton={false}
    />
  );
}