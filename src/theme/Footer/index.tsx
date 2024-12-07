import React from 'react';
import Footer from '@theme-original/Footer';
import { WideToastContainer } from '@site/src/components/Toasts';

export default function FooterWrapper(props) {
  return (
    <>
      <section>
        <WideToastContainer />
      </section>
      <Footer {...props} />
    </>
  );
}