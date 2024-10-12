import React from 'react';
import Footer from '@theme-original/Footer';
import { MyToastContainer } from '@site/src/components/Toasts';

export default function FooterWrapper(props) {
  return (
    <>
      <section>
        <MyToastContainer />
      </section>
      <Footer {...props} />
    </>
  );
}