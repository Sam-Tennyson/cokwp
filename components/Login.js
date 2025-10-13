import React, { useState } from "react";
import { useSnackbar } from "notistack";
import Link from "next/link";
import Router from "next/router";
import { useSessionStore } from "../stores/session";

const Login = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { handleSignIn } = useSessionStore((state) => state);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.API_LOCAL_URL);
    const data = {
      identifier: userDetail.email,
      password: userDetail.password,
    };
    
    try {
      setIsLoading(true);
      const res = await handleSignIn(userDetail.email, userDetail.password);
      enqueueSnackbar("Login Successfully", { variant: "success" });
      localStorage.setItem("authToken", res?.jwt);
      Router.push("/notes");
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 md:py-12 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-1/2 m-auto  bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-2xl mb-1 text-center font-medium title-font">
              Login
            </h2>
            <p className="leading-relaxed text-xl mb-5 text-center text-gray-600">
              Get access of free material
            </p>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
                >
                  Email
                </label>
                <input
                  value={userDetail.email}
                  onChange={handleChange}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 text-sm text-gray-600"
                >
                  Password
                </label>
                <input
                  value={userDetail.password}
                  onChange={handleChange}
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 pr-10 leading-8 transition-colors duration-200 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  title={isPasswordVisible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {isPasswordVisible ? (
                    // Eye off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.93 2.98-5.11 5.22-6.39" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                      <path d="M14.12 14.12 9.88 9.88" />
                      <path d="M21 21A10.94 10.94 0 0 1 23 12c-1.73-4.89-6-8-11-8a11 11 0 0 0-4.12.78" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <button disabled={isLoading} type="submit" className={`text-white ${isLoading ? "bg-gray-500" : "bg-indigo-500"} border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg`}>
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
