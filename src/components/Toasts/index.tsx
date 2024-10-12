import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { createToast } from './createToast';
import { ToastContainer } from 'react-toastify';


let colorMode: 'light' | 'dark' = 'light';

// Function to update the color mode
export const updateColorMode = (newColorMode: 'light' | 'dark') => {
  colorMode = newColorMode;
};

// Singleton showToast function
export const showToast = (message: string, type: 'info' | 'error' | 'success', toastId: string) => {
  createToast(message, type, colorMode, toastId);
};

// Hook to sync color mode with Docusaurus
export const useToastSync = () => {
  const { colorMode: currentColorMode } = useColorMode();

  // Sync the color mode on mount and whenever it changes
  React.useEffect(() => {
    updateColorMode(currentColorMode);
  }, [currentColorMode]);
};

export function MyToastContainer(): JSX.Element {
  return (
    <ToastContainer stacked/>
  )
}

