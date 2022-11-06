import { useEffect } from 'react';
import '../styles/globals.css';

import swInit from '../utils/swInit';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    swInit();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
