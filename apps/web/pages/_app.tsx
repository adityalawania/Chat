// apps/your-nextjs-app/pages/_app.js or _app.tsx
import { SessionProvider } from "next-auth/react";
import {SocketProvider} from '../context/SocketProvider'
import { AppProps } from "next/app";


function MyApp({ Component, pageProps }: AppProps) {
  return (

    <SocketProvider>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    </SocketProvider>
    

  );
}

export default MyApp;
