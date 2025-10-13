import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }) {
  const [foot, setFoot] = useState("");
  return (
    <>
      {/* <PersistGate persistor={persistor}> */}
      <SnackbarProvider
        autoHideDuration={3000}
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="min-h-screen flex flex-col w-full">
          <Navbar foot={foot} />
          <main className="md:w-4/5 w-full my-5 mx-auto flex-1 common-padding">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </SnackbarProvider>
      {/* </PersistGate> */}
    </>
  );
}

export default MyApp;
