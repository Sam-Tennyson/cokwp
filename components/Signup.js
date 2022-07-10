import React, { useState } from "react";
import { withSnackbar, useSnackbar } from "notistack";

const Signup = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    // console.log(e);
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      data: {
        userName: userDetail.name,
        email: userDetail.email,
        password: userDetail.password,
      },
    };

    console.log(userDetail, JSON.stringify(data));
    fetch("http://localhost:1337/api/cokwps/", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      // body: data,
    })
      .then((response) => {
        response.text();
      })
      .then((data) => {
        console.log("Success:", data);
        enqueueSnackbar("Account created successfully", { variant: "success" });
        setUserDetail({ name: "", email: "", password: "" });
      })
      .catch((error) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
        console.error("Error:", error);
      });
  };

  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 md:py-12 mx-auto flex sm:flex-nowrap flex-wrap">
          {/* <div className="mx-5 sm:w-1/2  sm:m-auto md:mx-5  ">
      <img src="/child.png" alt="error" />
      </div> */}

          <div className="lg:w-1/2 m-auto  bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-2xl mb-1 text-center font-medium title-font">
              Sign into you account
            </h2>
            <p className="leading-relaxed text-xl mb-5 text-center text-gray-600">
              Create your account
            </p>
            <form onSubmit={handleSubmit}>
              {" "}
              <div className="relative mb-4">
                <label
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600"
                >
                  Name
                </label>
                <input
                  value={userDetail.name}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your Name"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
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
                {/* <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea> */}
              </div>
              <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Sign Up
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Already have an account
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default withSnackbar(Signup);
