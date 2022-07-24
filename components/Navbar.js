import React, { useEffect, useState } from "react";
import Link from "next/link";

import { BiMessageRoundedDetail } from "react-icons/bi";
import { BiHome } from "react-icons/bi";
import { TiContacts } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";


const ISSERVER = typeof window === "undefined"

const Navbar = () => {
  const [showHead, setShowHead] = useState("");
  const [showOption, setShowOption] = useState(true);
  const [auth, setAuth] = useState("");
  const [flag, setFlag] = useState(false);
  let token;

  if (!ISSERVER) {
    token =localStorage.getItem("authToken")
  }
  
  useEffect(()=> {
    setAuth(token);
    
  },[token])
  const  closeModal = ()=> {
    setFlag(false)
  }

  const handleOpenModal = ()=> {
    console.log("asdf")
    setFlag(true)
  }


  // setTimeout(function () {
  //   let token = localStorage.getItem("authToken");
  //   setAuth(token);
  // }, 50);

  console.log(auth, "auth");
  return (
    <>
      {/* <CustomModal openModal={flag}  onClickClose={closeModal} /> */}
      <header className="text-gray-500 sm:text-sm body-font m-auto border-b-0 ">
        <div className="container mx-auto md:mb-4 flex flex-wrap p-3 px-5   justify-between flex-row md:flex-row items-center">
          <Link href={"/"}>
            <a className="flex title-font font-medium items-center lg:mx-20  text-gray-900 mb-4 md:mb-0">
              <img src="/download.png" width="30px" alt="" />
              <span className="ml-3 text-xl mx-10">COKWP</span>
            </a>
          </Link>
          <nav
            className={`md:ml-auto md:flex hidden md:flex-row md:flex-wrap md:items-center  `}
          >
            <BiHome />
            <Link href={"/"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Dashboard")}
              >
                Home
              </a>
            </Link>

            <BiMessageRoundedDetail />
            <Link href={"/about"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("About Us")}
              >
                About Us
              </a>
            </Link>
            <TiContacts />
            <Link href={"/contact"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("About Us")}
              >
                Contact Us
              </a>
            </Link>
            {!auth ? (
              <>
                <Link href={"/signup"}>
                  <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0 mx-2">
                    Sign Up
                  </button>
                </Link>
                <Link href={"/login"}>
                  <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <Link href={"/"}>
                <button
                  className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
                  onClick={() => {
                    setShowOption(true);
                    localStorage.setItem("authToken","")
                    setAuth("")
                  }}
                >
                  Logout
                </button>
              </Link>
            )}
          </nav>
          
          <div
            onClick={() => setShowOption(!showOption)}
            className="md:ml-auto flex flex-row block md:hidden  flex-wrap items-center  justify-center"
          >
            <GiHamburgerMenu />
          </div>
        </div>
      </header>
      <nav
        className={` text-gray-500 bg-yellow-100 p-3 ${
          showOption ? "hidden" : "flex"
        } text-sm body-font m-auto border-b-0 ml-auto md:hidden flex-col flex-wrap items-center `}
      >
        <div className="flex  flex-row mb-3 items-center">
          <BiHome />
          <Link href={"/"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              Home
            </a>
          </Link>
        </div>

        
        <div className="flex flex-row mb-3 items-center">
          <BiMessageRoundedDetail />
          <Link href={"/about"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              About Us
            </a>
          </Link>
        </div>
        <div className="flex flex-row mb-3 items-center">
          <TiContacts />
          <Link href={"/contact"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              Contact Us
            </a>
          </Link>
        </div>
        <div className="flex flex-row mb-3 items-center">
          {!auth ? (
            <>
              <Link href={"/signup"}>
                <button
                  className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0 mx-2"
                  onClick={() => {
                    setShowOption(true);
                  }}
                >
                  Sign Up
                </button>
              </Link>
              <Link href={"/login"}>
                <button
                  className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
                  onClick={() => {
                    setShowOption(true);
                  }}
                >
                  Login
                </button>
              </Link>
            </>
          ) : (
            <Link href={"/"}>
              <button
                className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
                onClick={() => {
                  setShowOption(true);
                  localStorage.setItem("authToken","")
                  setAuth("")
                }}
              >
                Logout
              </button>
            </Link>
          )}
        </div>
        {/* {auth.length && 
        <div className="flex flex-row mb-3 items-center">
        <Link href={"/"}>
            <button
              className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0 mx-2"
              onClick={() => {
                setShowOption(true);

              }}
            >
              Logout
            </button>
          </Link> 
        </div>
        } */}
      </nav>
      
    </>
  );
};

export default Navbar;
