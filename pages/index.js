import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link"
import CustomModal from "../components/CustomModal";

const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

export default function Home(props) {
  // const [playlist1, setPlaylist1] = useState(props?.playlist1);
  // const [playlist2, setPlaylist2] = useState(props?.playlist2);
  // const [playlist3, setPlaylist3] = useState(props?.playlist3);
  // const [playlist4, setPlaylist4] = useState(props?.playlist4);

  const [playlist1, setPlaylist1] = useState("");
  const [playlist2, setPlaylist2] = useState("");
  const [playlist3, setPlaylist3] = useState("");
  const [playlist4, setPlaylist4] = useState("");
  const [playlist5, setPlaylist5] = useState("");

  useEffect(() => {
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhEr5Q7AU27PShvGC3wZ_9P1&maxResult=50&key=AIzaSyCYj_AmGzhQrwD2FfmeyyUrBrWnqn4uSvY`
    )
      .then((res) => res.json())
      .then((data) => setPlaylist1(data));
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhE0r2XNYu0UUAIyh_1CihCC&maxResult=50&key=AIzaSyCYj_AmGzhQrwD2FfmeyyUrBrWnqn4uSvY`
    )
      .then((res) => res.json())
      .then((data) => setPlaylist2(data));
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhG3e1l5F2C6aOHj3OIkIvWl&maxResult=50&key=AIzaSyCYj_AmGzhQrwD2FfmeyyUrBrWnqn4uSvY`
    )
      .then((res) => res.json())
      .then((data) => setPlaylist3(data));
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhHoXnJAB4NkJyzl_VORwjfb&maxResult=50&key=AIzaSyCYj_AmGzhQrwD2FfmeyyUrBrWnqn4uSvY`
    )
      .then((res) => res.json())
      .then((data) => setPlaylist4(data));
    fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhGpdZZXSBCHGnfs2S-9BZYl&maxResult=50&key=AIzaSyCYj_AmGzhQrwD2FfmeyyUrBrWnqn4uSvY`
    )
      .then((res) => res.json())
      .then((data) => setPlaylist5(data));
  }, []);

  // useEffect(()=> {
  //   setPlaylist1(props?.playlist1)
  // },[props.playlist1])

  // useEffect(()=> {
  //   setPlaylist2(props?.playlist2)
  // },[props.playlist2])

  // useEffect(()=> {
  //   setPlaylist3(props?.playlist3)
  // },[props.playlist3])

  // useEffect(()=> {
  //   setPlaylist4(props?.playlist4)
  // },[props.playlist4])

  // console.log(props.playlist1);
  const [flag, setFlag] = useState(false);


  const  closeModal = ()=> {
    setFlag(false)
  }

  const handleOpenModal = ()=> {
    // console.log("asdf")
    setFlag(true)
  }
  return (
    <>
      <div>
      <CustomModal openModal={flag}  onClickClose={closeModal} />
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 md:py-24 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              cLuStEr OF kNoWleDgE{" "}
                <br className="hidden lg:inline-block" />
                with Priya
              </h1>
              <p className="mb-8 leading-relaxed">
                I made this website especially for knowledge purpose....not just
                for you..but also for myself ...to make myself busy in{" "}
                <br className="hidden lg:inline-block" />
                Activities..that will not only help in build up my knowledge bt
                by sharing it I can meet new peoples like all of you ..so that I
                can..get a lot of views and ideas that will help me in.thinking
                out of the boxl!.
              </p>
              <div className="flex justify-center">
                <Link href={"/free-videos"}>
                <button className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg">
                  More Videos
                </button>
                </Link>
                <Link href={"/quiz"}>
                <button className="ml-4 inline-flex text-white bg-gradient-to-r from-purple-500 to-pink-500 border-0 py-2 px-6 focus:outline-none hover:from-purple-600 hover:to-pink-600 rounded text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                  🎯 Test Your Knowledge
                </button>
                </Link>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
              <img
                className="object-cover object-center rounded"
                alt="hero"
                src="/child.png"
              />
            </div>
          </div>
        </section>
        <section className="text-gray-600 body-font">
          <h2 className="text-3xl font-medium title-font text-gray-900 my-10 text-center">
            Latest Videos
          </h2>
          <div className="container px-5 mx-auto">
            <div className="flex flex-wrap -m-4">
              {/* 18 77 */}
              {playlist5 &&
                playlist5?.items?.map((item) => {
                  // console.log("item", item);
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
                      <div className="h-full shadow-lg bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                        <a
                          href={`https://www.youtube.com/watch?v=${resourceId?.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            width={medium?.width}
                            height={medium?.height}
                            src={medium?.url}
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
                        
                        
                      </div>
                    </div>
                  );
                })}
              {playlist1 &&
                playlist1?.items?.map((item) => {
                  // console.log("item", item);
                  const { id, snippet = {} } = item;
                  const {
                    title,
                    thumbnails = {},
                    resourceId,
                    description,
                  } = snippet;
                  const { medium = {} } = thumbnails;

                  return (
                    <div key={id} className="p-4 md:4/5 lg:w-1/3 ">
                      {/* <div className=" bg-red-500 "> */}
                      <div className="h-full shadow-lg  bg-opacity-75 px-8 pt-16 pb-12 rounded-lg overflow-hidden text-center relative">
                        <a
                          href={`https://www.youtube.com/watch?v=${resourceId?.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            width={medium?.width}
                            height={medium?.height}
                            src={medium?.url}
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
                      </div>
                    </div>
                  );
                })}
              {/* {playlist2?.items?.map((item) => {
                // console.log("item", item);
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
                    <div className="h-full shadow-lg bg-opacity-75 px-8 pt-16 pb-12 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    </div>
                  </div>
                );
              })}

               {playlist3?.items?.map((item) => {
                // console.log("item", item);
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
                    <div className="h-full shadow-lg bg-opacity-75 px-8 pt-16 pb-12 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    </div>
                  </div>
                );
              })}
              {playlist4?.items?.map((item) => {
                // console.log("item", item);
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
                    <div className="h-full shadow-lg bg-opacity-75 px-8 pt-16 pb-12 rounded-lg overflow-hidden text-center relative">
                      <a
                        href={`https://www.youtube.com/watch?v=${resourceId.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    </div>
                  </div>
                );
              })} */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// export async function getServerSideProps() {
//   const res1 = await fetch(
//     `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhEr5Q7AU27PShvGC3wZ_9P1&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
//   );
//   const playlist1 = await res1.json();
//   const res2 = await fetch(
//     `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhE0r2XNYu0UUAIyh_1CihCC&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
//   );
//   const playlist2 = await res2.json();
//   const res3 = await fetch(
//     `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhG3e1l5F2C6aOHj3OIkIvWl&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
//   );
//   const playlist3 = await res3.json();
//   const res4 = await fetch(
//     `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLQ5xEuNctHhHoXnJAB4NkJyzl_VORwjfb&maxResult=50&key=${process.env.YOUTUBE_API_KEY}`
//   );
//   const playlist4 = await res4.json();
//   // console.log(playlist1);
//   // console.log(playlist2,"2");
//   // console.log(playlist3, "3");
//   // console.log(playlist4, "4");
//   return {
//     props: {
//       playlist1,
//       playlist2,
//       playlist3,
//       playlist4,
//     },
//   };
// }
