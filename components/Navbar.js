import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [flag, setFlag] = useState(false);
  return (
    <>
      <nav className="bg-dark  border-gray-200 px-6 py-6 dark:bg-gray-800">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link href={"/"}>
            <a className="flex items-center">
              {/* <img src="/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo"> */}
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
            {/* <span className="sr-only">Open main menu</span> */}
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
              <Link href={"/"}>
                <li>
                  <a
                    href="#"
                    className="block px-5 py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
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
                  >
                    Blogs
                  </a>
                </li>
              </Link>
              <Link href={"/about"}>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
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
                  >
                    Contact
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      {/* <nav className="bg-dark  border-gray-200 px-2 sm:px-4 py-4 dark:bg-gray-800"></nav> */}
      <nav className=" bg-gray-800 border-gray-200 px-12  py-5 dark:bg-gray-400 "    >
      <div className="container flex flex-wrap justify-between items-center mx-auto flex-col sm:flex sm:flex-row sm:justify-between ">
      <Link href={"/"}>
            <a className="flex items-center">
              {/* <img src="/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo"> */}
              <span className="self-center mx-8 text-xl text-white font-semibold whitespace-nowrap my-1.5 dark:text-white">
                Dashboard
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
