import React, { useEffect, useState } from "react";
import Link from "next/link";

import { BiMessageRoundedDetail } from "react-icons/bi";
import { BiHome } from "react-icons/bi";
import { TiContacts } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSessionStore } from "../stores/session";

const Navbar = () => {
  const { handleSignOut } = useSessionStore()
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const [showHead, setShowHead] = useState("");
  const [showOption, setShowOption] = useState(true);

  return (
    <>
      <header className="text-gray-500 sm:text-sm body-font m-auto border-b-0 w-full">
        <div className="container mx-auto md:mb-4 flex flex-wrap p-3 px-5   justify-between flex-row md:flex-row items-center">
          <Link href={"/"}>
            <a className="flex title-font font-medium items-center lg:mx-20  text-gray-900 mb-4 md:mb-0">
              <img src="/download.png" width="30px" alt="" />
              <span className="ml-3 text-xl mx-10">COKWP</span>
            </a>
          </Link>
          <nav
            className={`md:ml-auto md:flex hidden md:flex-row md:flex-wrap md:items-center `}
          >
            <BiHome />
            {isAuthenticated && <Link href={"/quiz"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Dashboard")}
              >
                Quiz
              </a>
            </Link>}

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
            {!isAuthenticated ? (
              <>
                {/* <Link href={"/signup"}>
                  <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0 mx-2">
                    Sign Up
                  </button>
                </Link> */}
                <Link href={"/login"}>
                  <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <button
                className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
                onClick={async () => {
                  setShowOption(true);
                  localStorage.setItem("authToken", "")
                  await handleSignOut()
                }}
              >
                Logout
              </button>
            )}
          </nav>

          <div
            onClick={() => setShowOption(!showOption)}
            className="md:ml-auto flex flex-row md:hidden  flex-wrap items-center  justify-center"
          >
            <GiHamburgerMenu />
          </div>
        </div>
      </header>
      <nav
        className={` text-gray-500 bg-yellow-100 p-3 ${showOption ? "hidden" : "flex"
          } text-sm body-font m-auto border-b-0 ml-auto md:hidden flex-col flex-wrap items-center w-full`}
      >
        <div className="flex  flex-row mb-3 items-center">
          <BiHome />
          {isAuthenticated && <Link href={"/quiz"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              Quiz
            </a>
          </Link>}
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
          {!isAuthenticated ? (
            <>
              {/* <Link href={"/signup"}>
                <button
                  className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-blue-700 rounded text-white mt-4 md:mt-0 mx-2"
                  onClick={() => {
                    setShowOption(true);
                  }}
                >
                  Sign Up
                </button>
              </Link> */}
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
            <button
              className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
              onClick={async () => {
                setShowOption(true);
                localStorage.setItem("authToken", "")
                await handleSignOut()

              }}
            >
              Logout
            </button>
          )}
        </div>

      </nav>

    </>
  );
};

export default Navbar;
