import Head from "next/head";
import Script from "next/script";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import { useSessionStore } from "../stores/session";
import { useProfileStore } from "../stores/profile";

function MyApp({ Component, pageProps }) {
  const [foot, setFoot] = useState("");
  const userSession = useSessionStore((state) => state.userSession);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (hasHydrated && userSession?.id) {
      fetchProfile(userSession.id);
    }
  }, [hasHydrated, userSession?.id, fetchProfile]);

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
