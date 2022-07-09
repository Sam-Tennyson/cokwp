import React, { useState } from "react";
import Link from "next/link";
import CustomModal from "./CustomModal";

const Navbar = () => {

  const [showHead, setShowHead] = useState("");
  // const [flag, setFlag] = useState(false);


  // const  closeModal = ()=> {
  //   setFlag(false)
  // }

  // const handleOpenModal = ()=> {
  //   console.log("asdf")
  //   setFlag(true)
  // }

  return (
    <>
     {/* <CustomModal openModal={flag}  onClickClose={closeModal} /> */}
      <header className="text-gray-500 sm:text-sm body-font m-auto border-b-0">
        <div className="container mx-auto mb-4  flex flex-wrap p-3  flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center lg:mx-20  text-gray-900 mb-4 md:mb-0">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg> */}
            <img src="/download.png" width="30px" alt="" />
            <span className="ml-3 text-xl mx-10">COKWP</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center  justify-center">
            <Link href={"/"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Dashboard")}
              >
                Home
              </a>
            </Link>
            {/* <Link href={"/blogs"}> */}
            {/* <Link href={"/"}>
              <a
                className="mr-5 hover:text-gray-900"
                // onClick={() => setShowHead("Blogs")}
                onClick={handleOpenModal}
              >
                Blogs
              </a>
            </Link> */}
            <Link href={"/about"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("About Us")}
              >
                About Us
              </a>
            </Link>
            <Link href={"/contact"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("About Us")}
              >
                Contact Us
              </a>
            </Link>
            
          </nav>
          {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button> */}
        </div>
      </header>
      
      {/* <nav className=" bg-cyan-600 border-gray-200 py-5  ">
        <div className="container flex flex-wrap justify-between items-center mx-auto flex-col sm:flex sm:flex-row sm:justify-between ">
          <Link href={"/"}>
            <a className="flex items-center lg:mx-20">
              <span className="self-center mx-8 text-xl text-white font-semibold whitespace-nowrap my-1.5 dark:text-white">
                {showHead ? showHead : "Dashboard"}
              </span>
            </a>
          </Link>
          <input
            type="search"
            className="px-5 py-2 rounded sm:w-2/5 md:w-2/5 lg:w-1/5 my-1.5"
            placeholder="Search here..."
          />
        </div>
      </nav> */}
      {/* <div className="mx-3 sm:w-4/5  sm:m-auto  ">
      <img src="/child.png" alt="error" />
      </div> */}
        
    </>
  );
};

export default Navbar;
