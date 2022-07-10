import React from "react";

const Login = () => {
  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 md:py-12 mx-auto flex sm:flex-nowrap flex-wrap">
          {/* <div className="mx-5 sm:w-1/2  sm:m-auto md:mx-5  ">
      <img src="/child.png" alt="error" />
      </div> */}

          <div className="lg:w-1/2 m-auto  bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-2xl mb-1 text-center font-medium title-font">
              Login
            </h2>
            <p className="leading-relaxed text-xl mb-5 text-center text-gray-600">
              Get access of free material
            </p>
          
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              {/* <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea> */}
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Login
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Don't have an account 
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
