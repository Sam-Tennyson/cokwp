import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [foot, setFoot] = useState("")
  return (
    <>
      <Navbar foot={foot} />
      <div className="w-4.5/5 sm:w-4/5 my-5 m-auto">
        <Component {...pageProps} />
      </div>
        
      <Footer />
    </>
  );
}

export default MyApp;
