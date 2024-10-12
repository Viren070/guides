import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import KoFiWrapper from '@site/src/components/KoFiWidgetWrapper';
import { MyToastContainer } from '@site/src/components/Toasts';
export default {
  ...ComponentTypes,
  'custom-kofi': KoFiWrapper,
  'custom-toastcontainer': () => <MyToastContainer />,
};