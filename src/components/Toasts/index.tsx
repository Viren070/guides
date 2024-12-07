import { ToastContainer, toast, Slide } from 'react-toastify';
import styles from './styles.module.css';

// Singleton showToast function
export const showToast = (message: string, type: 'info' | 'error' | 'success', toastId?: string) => {
  toast(message, {
    type: type,
    toastId: toastId,
    className: styles.wideToast,
  });
};

export function WideToastContainer(): JSX.Element {
  return (
    <ToastContainer
      stacked
      position="top-center"
      autoClose={3500}
      hideProgressBar
      draggablePercent={60}
      draggableDirection='y'
      draggable="touch"
      theme="colored"
      transition={Slide}
      className={styles.wideToastContainer}
      closeButton={false}
    />
  );
}