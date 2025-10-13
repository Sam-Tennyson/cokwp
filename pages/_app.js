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
        <div className="min-h-screen flex flex-col">
          <Navbar foot={foot} />
          <main className="w-4/5 my-5 m-auto flex-1">
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
