import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/lib/integration/react";
// import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }) {
  const [foot, setFoot] = useState("");
  return (
    <>
      <Provider store={store}>
        {/* <PersistGate persistor={persistor}> */}
          <SnackbarProvider
            autoHideDuration={3000}
            maxSnack={3}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Navbar foot={foot} />
            <div className="w-4.5/5 sm:w-4/5 my-5 m-auto">
              <Component {...pageProps} />
            </div>
            <Footer />
          </SnackbarProvider>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
}

export default MyApp;
