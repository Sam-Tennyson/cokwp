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
      const res = await handleSignIn(userDetail.email, userDetail.password);
      enqueueSnackbar("Login Successfully", { variant: "success" });
      localStorage.setItem("authToken", res?.jwt);
      Router.push("/notes");
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
      return;
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
                  htmlFor="message"
                  className="leading-7 text-sm text-gray-600"
                >
                  Password
                </label>
                <input
                  value={userDetail.password}
                  onChange={handleChange}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Login
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Don &apos;t have an account | Please{" "}
                <Link href="/signup">
                  <button style={{ color: "blue" }}>Sign Up</button>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
