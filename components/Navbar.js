import React, { useEffect, useState } from "react";
import Link from "next/link";

import { BiMessageRoundedDetail } from "react-icons/bi";
import { BiHome } from "react-icons/bi";
import { TiContacts } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSessionStore } from "../stores/session";
import { useProfileStore } from "../stores/profile";
import Router from "next/router";

const Navbar = () => {
  const { handleSignOut } = useSessionStore()
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const profile = useProfileStore((state) => state.profile)
  const isAdmin = useProfileStore((state) => state.isAdmin)
  const [showHead, setShowHead] = useState("");
  const [showOption, setShowOption] = useState(true);

  const handleSignOutClick = async () => {
    setShowOption(true);
    localStorage.setItem("authToken", "")
    await handleSignOut()
    Router.push('/')
  }

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
            {/* <Link href={"/premium-courses"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Premium Courses")}
              >
                Premium Courses
              </a>
            </Link> */}
            {isAuthenticated && <Link href={"/quiz"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Dashboard")}
              >
                Quiz
              </a>
            </Link>}
            {isAuthenticated && <Link href={"/results"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Results")}
              >
                Results
              </a>
            </Link>}
            {isAuthenticated && <Link href={"/profile/purchases"}>
              <a
                className="mr-5 hover:text-gray-900"
                onClick={() => setShowHead("Purchases")}
              >
                Purchases
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
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || "User"}
                  </span>
                  {isAdmin && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                    {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-white mt-4 md:mt-0 mx-2"
                  onClick={handleSignOutClick}
                >
                  Logout
                </button>
              </div>
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
          {/* <Link href={"/premium-courses"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              Premium Courses
            </a>
          </Link> */}
          {isAuthenticated && <Link href={"/quiz"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              Quiz
            </a>
          </Link>}
        </div>

        {isAuthenticated && <div className="flex flex-row mb-3 items-center">
          <Link href={"/results"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              📊 Results
            </a>
          </Link>
        </div>}

        {isAuthenticated && <div className="flex flex-row mb-3 items-center">
          <Link href={"/profile/purchases"}>
            <a
              className="mr-5 hover:text-gray-900"
              onClick={() => setShowOption(true)}
            >
              🛒 Purchases
            </a>
          </Link>
        </div>}

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
            <div className="flex flex-col w-full gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || "User"}
                  </div>
                  {profile?.email && profile?.first_name && (
                    <div className="text-xs text-gray-500">{profile.email}</div>
                  )}
                  {isAdmin && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded text-white w-full"
                onClick={handleSignOutClick}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </nav>

    </>
  );
};

export default Navbar;
