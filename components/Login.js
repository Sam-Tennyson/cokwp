import React, { useState } from "react";
import { withSnackbar, useSnackbar } from "notistack";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import set_Notes from "../redux/Reducers/Notes";
import { setNotes } from "../redux/Actions/nodes";
import { useDispatch, useSelector } from "react-redux";
const Login = () => {
  const dispatch = useDispatch();
  const notesD = useSelector((state)=> state.notes)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    // console.log(e);
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      // data: {
        identifier: userDetail.email,
        password: userDetail.password,
      // },
    };

    const response = await fetch("https://strapi-for-cokwp.herokuapp.com/api/auth/local/", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
      // body: data,
    })
    const res = await response.json();
    console.log(res); 
    if (res?.jwt) {
      enqueueSnackbar("Login Successfully", {variant: "success"})
      localStorage.setItem("authToken", res?.jwt)
      Router.push("/notes")
      // if (res?.jwt) {
      //   const privateRoute = await fetch("http://localhost:1337/api/notes/", {
      //     method: "GET",
      //     headers: {
      //       "content-Type": "application/json",
      //     "accept": "application/json",
      //       "Authorization": `Bearer ${res?.jwt}`
      //     }
        // })
      // const noteData = await privateRoute.json()
      // dispatch(setNotes(noteData.data))
      // console.log(noteData)
      // }
    } else {
      enqueueSnackbar(res?.error?.message,{variant: "error"})
    }

  };
  console.log(notesD)
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
                {/* <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea> */}
              </div>
              <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Login
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Don &apos;t have an account | Please <Link href="/signup"><button style={{color: "blue"}}>Sign Up</button></Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
