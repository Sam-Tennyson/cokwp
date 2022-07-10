import React from "react";

const contact = () => {
  return (
    <>
      {/* <div className="mx-3 sm:w-4/5  sm:m-auto  ">
      <img src="/download.jpg" alt="error" />
      </div> */}
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-12 mx-auto">
          {/* <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Contact Us
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Feel free to contact...
            </p>
          </div> */}
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              {/* <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  Button
                </button>
              </div> */}
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <a className="text-indigo-500">
                  clusterofknowledge53@gmail.com
                </a>
                {/* <p className="leading-normal my-5"> */}
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                  Cluster of knowledge with Priya
                </h1>
                {/* </p> */}
                <span className="inline-flex">
                  <a className="text-gray-500">
                    
                    <img src="/icons8Facebook.png" alt="error" />
                  </a>
                  <a className="ml-4 text-gray-500" href="https://t.me/cLuStErOfKnOwLedgPS" target="_blank" rel="noopener noreferrer" >
                    <img src="/icons8Telegram.png" alt="error" />
                  </a>
                  <a className="ml-4 text-gray-500 cursor-pointer" href="https://www.instagram.com/clusterofknowledge_priya/?igshid=YmMyMTA2M2Y=" rel="noopener noreferrer" target="_blank">
                    <img src="/icons8Instagram.png" alt="error" />
                  </a>
                  {/* <a className="ml-4 text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-12 h-12"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a> */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default contact;
