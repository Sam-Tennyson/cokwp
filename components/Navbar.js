import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [flag, setFlag] = useState(false);
  const [showHead, setShowHead] = useState("")
  return (
    <>
      <header className="text-gray-600 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center lg:mx-20  text-gray-900 mb-4 md:mb-0">
      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg> */}
      <img src="/download.png" width="30px" alt="" />
      <span className="ml-3 text-xl mx-10">COKWP</span>
    </a>
    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
    <Link href={"/"} >
      <a className="mr-5 hover:text-gray-900" onClick={()=>setShowHead("Dashboard")}>Home</a>
      </Link>
      <Link href={"/blogs"} >
      <a className="mr-5 hover:text-gray-900" onClick={()=>setShowHead("Blogs")}>Blogs</a></Link>
      <Link href={"/about"} >
      <a className="mr-5 hover:text-gray-900" onClick={()=>setShowHead("About Us")}>About Us</a>
      </Link>

 
    </nav>
    {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button> */}
  </div>
</header>
      {/* <nav className="bg-dark  border-gray-200 px-6 py-6 dark:bg-gray-800 ">
        <div className="container flex flex-wrap justify-between items-center mx-auto ">
          <Link href={"/"} >
            <a className="flex items-center lg:mx-20" onClick={()=>setShowHead("Dashboard")}>
              
              <span className="self-center mx-6  text-xl font-semibold whitespace-nowrap dark:text-white">
                COKWP
              </span>
            </a>
          </Link>
          <button
            data-collapse-toggle="mobile-menu"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => setFlag(!flag)}
          >
            
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={`${
              flag
                ? "w-full md:block md:w-auto"
                : "hidden w-full md:block md:w-auto"
            }`}
            id="mobile-menu"
          >
            <ul className="flex items-center px-12 flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <Link href={"/"} >
                <li>
                  <a
                    href="#"
                    className="block px-5 py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                    onClick={()=>setShowHead("Dashboard")}
                  >
                    Home
                  </a>
                </li>
              </Link>
              <Link href={"/blogs"}>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={()=>setShowHead("Blogs")}
                  >
                    Blogs
                  </a>
                </li>
              </Link>
              <Link href={"/about"} >
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={()=>setShowHead("About Us")}
                  >
                    About
                  </a>
                </li>
              </Link>
              <Link href={"/contact"}>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                     onClick={()=>setShowHead("Contact Us")}
                  >
                    Contact
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav> */}
      {/* <nav className="bg-dark  border-gray-200 px-2 sm:px-4 py-4 dark:bg-gray-800"></nav> */}
      <nav className=" bg-cyan-600 border-gray-200 py-5  "    >
      <div className="container flex flex-wrap justify-between items-center mx-auto flex-col sm:flex sm:flex-row sm:justify-between ">
      <Link href={"/"}>
            <a className="flex items-center lg:mx-20">
              
              <span className="self-center mx-8 text-xl text-white font-semibold whitespace-nowrap my-1.5 dark:text-white">
                {showHead ? showHead : "Dashboard"}
              </span>
            </a>
          </Link>
          <input type="search" className="px-5 py-2 rounded sm:w-2/5 md:w-2/5 lg:w-1/5 my-1.5" placeholder="Search here..." />
          </div>
      </nav>
    </>
  );
};

export default Navbar;
