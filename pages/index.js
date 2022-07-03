import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";


const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

export default function Home(props) {
  const [playlist1, setPlaylist1] = useState(props?.playlist1);
  const [playlist2, setPlaylist2] = useState(props?.playlist2);
  const [playlist3, setPlaylist3] = useState(props?.playlist3);
  const [playlist4, setPlaylist4] = useState(props?.playlist4);
  console.log(props.playlist1);

  return (
    <>
      <div>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-wrap -m-4">
              {/* 18 77 */}
              {playlist1?.items.map((item) => {
                console.log("item", item);
                const { id, snippet = {} } = item;
                const {
                  title,
                  thumbnails = {},
                  resourceId,
                  description,
                } = snippet;
                const { medium = {} } = thumbnails;

                return (
                  <div key={id} className="p-4 md:4/5 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                      >
                        <img
                          width={medium.width}
                          height={medium.height}
                          src={medium.url}
                          alt="error"
                          className="w-full"
                        />
                        {/* <Image
                          width={medium.width}
                          height={medium.height}
                          src={medium.url}
                          alt="error"
                          layout="fill" /> */}
                      </a>

                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                        {title}
                      </h1>
                      <p className="leading-relaxed mb-3">{description}</p>
                      <a className="text-indigo-500 inline-flex items-center">
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          1.2K
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {playlist2?.items.map((item) => {
                console.log("item", item);
                const { id, snippet = {} } = item;
                const {
                  title,
                  thumbnails = {},
                  resourceId,
                  description,
                } = snippet;
                const { medium = {} } = thumbnails;

                return (
                  <div key={id} className="p-4 md:4/5 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                      >
                        <img
                          width={medium.width}
                          height={medium.height}
                          src={medium.url}
                          alt="error"
                          className="w-full"
                        />
                      </a>

                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                        {title}
                      </h1>
                      <p className="leading-relaxed mb-3">{description}</p>
                      <a className="text-indigo-500 inline-flex items-center">
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          1.2K
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {playlist3?.items.map((item) => {
                console.log("item", item);
                const { id, snippet = {} } = item;
                const {
                  title,
                  thumbnails = {},
                  resourceId,
                  description,
                } = snippet;
                const { medium = {} } = thumbnails;

                return (
                  <div key={id} className="p-4 md:4/5 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                      >
                        <img
                          width={medium.width}
                          height={medium.height}
                          src={medium.url}
                          alt="error"
                          className="w-full"
                        />
                      </a>

                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                        {title}
                      </h1>
                      <p className="leading-relaxed mb-3">{description}</p>
                      <a className="text-indigo-500 inline-flex items-center">
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          1.2K
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {playlist4?.items.map((item) => {
                console.log("item", item);
                const { id, snippet = {} } = item;
                const {
                  title,
                  thumbnails = {},
                  resourceId,
                  description,
                } = snippet;
                const { medium = {} } = thumbnails;

                return (
                  <div key={id} className="p-4 md:4/5 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                      >
                        <img
                          width={medium.width}
                          height={medium.height}
                          src={medium.url}
                          alt="error"
                          className="w-full"
                        />
                      </a>

                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                        {title}
                      </h1>
                      <p className="leading-relaxed mb-3">{description}</p>
                      <a className="text-indigo-500 inline-flex items-center">
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          1.2K
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              
              
            </div>
            
          </div>
        </section>
        
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res1 = await fetch(
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhEr5Q7AU27PShvGC3wZ_9P1&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
  );
  const playlist1 = await res1.json();
  const res2 = await fetch(
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhE0r2XNYu0UUAIyh_1CihCC&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
  );
  const playlist2 = await res2.json();
  const res3 = await fetch(
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhG3e1l5F2C6aOHj3OIkIvWl&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
  );
  const playlist3 = await res3.json();
  const res4 = await fetch(
    `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhHoXnJAB4NkJyzl_VORwjfb&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
  );
  const playlist4 = await res4.json();
  console.log(playlist1);
  console.log(playlist2,"2");
  console.log(playlist3, "3");
  console.log(playlist4, "4");
  return {
    props: {
      playlist1,
      playlist2,
      playlist3,
      playlist4,
    },
  };
}
