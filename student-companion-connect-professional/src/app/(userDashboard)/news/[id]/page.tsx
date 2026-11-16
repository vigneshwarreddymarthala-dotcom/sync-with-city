"use client";

import Notify, { showToast } from "@/components/notify";
import { News } from "@/models/news.model";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NewsDetails = ({ params }: { params: { id: string } }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [newsInfo, setNewsInfo] = useState<News>();
  const [toggleShare, setToggleShare] = useState(false);

  const pathname = usePathname();
  const getCurrentURL = `${process.env.NEXT_PUBLIC_SITE_PATH}${pathname}`;

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getNews = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}news/${params.id}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();
        if (res.status == 200) {
          setNewsInfo(rInfo);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getNews();
  }, [authToken, params.id]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };
  return (
    <section className="container mx-auto flex justify-center">
      <Notify />
      {newsInfo && (
        <>
          {toggleShare && (
            <div className="fixed z-50 flex flex-col items-center bg-black bg-opacity-70 top-0 left-0 right-0 bottom-0">
              <div className="w-full max-w-xl mt-1 mb-5 px-2 flex flex-col items-center gap-2 relative">
                <h2 className="font-semibold text-3xl text-white mt-28">
                  Share On
                </h2>
                <a
                  onClick={() => setToggleShare(false)}
                  className="w-8 h-8 absolute right-0 top-24 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 32 32"
                    className="w-8 h-8 stroke-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="cross">
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2px"
                        x1="7"
                        x2="25"
                        y1="7"
                        y2="25"
                      />
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2px"
                        x1="7"
                        x2="25"
                        y1="25"
                        y2="7"
                      />
                    </g>
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://www.pinterest.com/pin/create/button?url=${getCurrentURL}&media=${getImgPath(
                    newsInfo.newsImg
                  )}&description=${newsInfo.newsTitle}`}
                  target="_blank"
                  title="Pinterest"
                  aria-label="Pinterest"
                  className="w-8 h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 500 500"
                    className="w-8 h-8"
                  >
                    <path
                      d="M500,250c0,138.07-111.93,250-250,250S0,388.07,0,250,111.93,0,250,0,500,111.93,500,250Z"
                      fill="#cb2128"
                    />
                    <path
                      d="M270.17,334.78c-18.89-1.48-26.83-10.84-41.65-19.85-8.16,42.74-18.1,83.71-47.61,105.12-9.09-64.6,13.36-113.13,23.81-164.61-17.78-30,2.13-90.24,39.67-75.38,46.17,18.26-40,111.35,17.86,123,60.39,12.14,85-104.77,47.59-142.81-54.12-54.9-157.52-1.24-144.79,77.36,3.09,19.21,23,25,7.92,51.57-34.62-7.68-45-35-43.63-71.4,2.16-59.6,53.55-101.33,105.12-107.12,65.24-7.29,126.45,24,134.89,85.3,9.51,69.24-29.44,144.22-99.18,138.85Z"
                      fill="#f2f2f2"
                    />
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://www.linkedin.com/shareArticle?url=${getCurrentURL}&title=${newsInfo.newsTitle}`}
                  target="_blank"
                  title="Linkedin"
                  aria-label="Linkedin"
                  className="w-8 h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 112.2 112.2"
                    className="w-8 h-8"
                  >
                    <circle cx="56.1" cy="56.1" r="56.1" fill="#007ab9" />
                    <path
                      d="M89.62,60.61V83.74H76.21V62.16c0-5.42-1.94-9.12-6.79-9.12A7.33,7.33,0,0,0,62.54,58a9.24,9.24,0,0,0-.45,3.27V83.74H48.68s.18-36.55,0-40.33H62.09v5.71c0,.05-.06.09-.08.14h.08v-.14a13.34,13.34,0,0,1,12.09-6.66c8.82,0,15.44,5.77,15.44,18.15ZM34.66,24c-4.59,0-7.59,3-7.59,7s2.91,7,7.41,7h.09c4.67,0,7.58-3.1,7.58-7s-2.91-7-7.49-7Zm-6.8,59.77H41.27V43.41H27.86Z"
                      fill="#f1f2f2"
                    />
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://twitter.com/intent/tweet?url=${getCurrentURL}&text=${newsInfo.newsTitle}&via=student-companion-connect`}
                  target="_blank"
                  title="Twitter"
                  aria-label="Twitter"
                  className="w-8 h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 112.2 112.2"
                    className="w-8 h-8"
                  >
                    <circle cx="56.1" cy="56.1" r="56.1" fill="#55acee" />
                    <path
                      d="M90.46,40.32a27.18,27.18,0,0,1-7.7,2.11A13.44,13.44,0,0,0,88.65,35a26.73,26.73,0,0,1-8.51,3.25A13.42,13.42,0,0,0,57.29,50.49a38,38,0,0,1-27.64-14,13.41,13.41,0,0,0,4.15,17.9,13.24,13.24,0,0,1-6.07-1.68v.17A13.41,13.41,0,0,0,38.48,66a13.25,13.25,0,0,1-3.53.47,13.05,13.05,0,0,1-2.52-.24A13.41,13.41,0,0,0,45,75.57,26.94,26.94,0,0,1,28.3,81.31a28.2,28.2,0,0,1-3.2-.19,38,38,0,0,0,20.55,6c24.67,0,38.16-20.43,38.16-38.15,0-.58,0-1.16,0-1.73a27.25,27.25,0,0,0,6.69-6.94Z"
                      fill="#f1f2f2"
                    />
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://api.whatsapp.com/send?text=${getCurrentURL}`}
                  target="_blank"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="w-8 h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-8 h-8"
                  >
                    <path
                      d="M24,48A24,24,0,1,0,0,24,24,24,0,0,0,24,48Z"
                      fill="#25d366"
                    />
                    <path
                      d="M24.79,37.35h0A14.31,14.31,0,0,1,18,35.62l-7.57,2,2-7.4a14.27,14.27,0,1,1,12.37,7.15ZM18.32,33l.43.26a11.84,11.84,0,0,0,6,1.65h0a11.86,11.86,0,1,0-10-5.56l.28.45-1.19,4.38Zm13.17-6.88a1.14,1.14,0,0,1,.49.33,2.94,2.94,0,0,1-.21,1.69,3.7,3.7,0,0,1-2.4,1.7,4.94,4.94,0,0,1-2.25-.14,21.51,21.51,0,0,1-2-.76,15.67,15.67,0,0,1-6-5.29L19,23.59h0a7,7,0,0,1-1.45-3.69A4,4,0,0,1,18.72,17a.46.46,0,0,1,.07-.07,1.29,1.29,0,0,1,.95-.45h.76c.21,0,.47,0,.72.61l.4,1c.3.75.64,1.57.7,1.69a.66.66,0,0,1,0,.63l-.05.1A2.16,2.16,0,0,1,22,21c-.06.07-.12.15-.19.22a5.26,5.26,0,0,1-.35.41.51.51,0,0,0-.15.72,10.3,10.3,0,0,0,2,2.47,9.28,9.28,0,0,0,2.63,1.67l.24.1c.35.18.56.15.77-.08s.89-1.05,1.13-1.4.47-.3.8-.18,2.08,1,2.44,1.16Z"
                      fill="#fdfdfd"
                    />
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://telegram.me/share/url?url=${getCurrentURL}&text=${newsInfo.newsTitle}`}
                  target="_blank"
                  aria-label="Telegram"
                  className="w-8 h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-8 h-8"
                  >
                    <defs>
                      <linearGradient
                        id="telegram"
                        x1="31.03"
                        y1="42.41"
                        x2="19.03"
                        y2="14.41"
                        gradientTransform="matrix(1, 0, 0, -1, 0, 50)"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#37aee2" />
                        <stop offset="1" stopColor="#1e96c8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M24,48A24,24,0,1,0,0,24,24,24,0,0,0,24,48Z"
                      fill="url(#telegram)"
                    />
                    <path
                      d="M8.94,25.17c2.8-1.54,5.94-2.83,8.86-4.13,5-2.12,10.09-4.21,15.2-6.15,1-.33,2.77-.65,3,.82-.1,2.08-.49,4.15-.76,6.22-.69,4.56-1.48,9.1-2.25,13.64a2.16,2.16,0,0,1-3.38,1.33c-2.91-2-5.85-3.92-8.72-5.93-.95-1-.07-2.34.77-3,2.4-2.36,4.94-4.37,7.22-6.86.61-1.48-1.2-.23-1.8.15-3.28,2.26-6.49,4.67-10,6.65-1.77,1-3.83.15-5.6-.4-1.59-.65-3.91-1.32-2.54-2.32Z"
                      fill="#fff"
                    />
                  </svg>
                </a>
                <a
                  rel="nofollow noopener"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${getCurrentURL}`}
                  target="_blank"
                  className="w-8 h-8"
                  aria-label="Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-8 h-8"
                  >
                    <circle cx="256" cy="256" r="256" fill="#3f65a6" />
                    <path
                      d="M217.1,171.8v40.4H187.5v49.4h29.6V397h60.8V261.5h40.8s3.8-23.7,5.7-49.6H278.2V178.1c0-5,6.6-11.8,13.2-11.8h33.1V114.9h-45C215.6,115,217.1,164.4,217.1,171.8Z"
                      fill="#fff"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
          <div className="w-full max-w-xl mt-1 mb-5 px-2">
            <div className="relative">
              <a
                onClick={() => setToggleShare(true)}
                className=" cursor-pointer absolute right-1 top-1 bg-orange flex gap-2 items-center p-2 text-white font-medium rounded-lg text-sm shadow-md"
              >
                Share
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 525.152 525.152"
                  enableBackground="new 0 0 525.152 525.152"
                  className="w-5 h-5 fill-white"
                >
                  <g>
                    <path
                      d="M420.735,371.217c-20.021,0-37.942,7.855-51.596,20.24L181.112,282.094c1.357-6.061,2.407-12.166,2.407-18.468
		c0-6.302-1.072-12.385-2.407-18.468l185.904-108.335c14.179,13.129,32.931,21.334,53.719,21.334
		c43.828,0,79.145-35.251,79.145-79.079C499.88,35.338,464.541,0,420.735,0c-43.741,0-79.079,35.338-79.079,79.057
		c0,6.389,1.072,12.385,2.407,18.468L158.158,205.947c-14.201-13.194-32.931-21.378-53.741-21.378
		c-43.828,0-79.145,35.317-79.145,79.057s35.317,79.079,79.145,79.079c20.787,0,39.54-8.206,53.719-21.334l187.698,109.604
		c-1.291,5.58-2.101,11.4-2.101,17.199c0,42.45,34.594,76.979,76.979,76.979c42.428,0,77.044-34.507,77.044-76.979
		S463.163,371.217,420.735,371.217z"
                    />
                  </g>
                </svg>
              </a>
              {newsInfo.newsImg && (
                <Image
                  src={getImgPath(newsInfo.newsImg)}
                  alt={newsInfo.newsTitle}
                  width={300}
                  height={250}
                  className="w-full h-auto object-cover object-center rounded mb-3"
                />
              )}
            </div>

            <h2 className="font-semibold text-3xl text-orange">
              {newsInfo.newsTitle}
            </h2>
            {/* <h3 className="my-4 font-medium flex gap-2 items-center">
              <svg
                enableBackground="new 0 0 64 64"
                version="1.1"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-orange"
              >
                <g id="Glyph">
                  <path d="M52.708,20.849C52.708,8.185,44.584,0,32,0S11.292,8.185,11.292,20.849c0,10.556,16.311,31.747,18.175,34.118l2.278,2.928   c-9.542,0.025-17.237,1.38-17.237,3.051c0,1.686,7.836,3.053,17.502,3.053s17.502-1.367,17.502-3.053   c0-1.672-7.704-3.028-17.255-3.051l2.292-2.928C36.396,52.581,52.708,31.39,52.708,20.849z M25.294,20.835   c0-3.604,3.002-6.526,6.706-6.526c3.704,0,6.706,2.922,6.706,6.526S35.704,27.361,32,27.361   C28.296,27.361,25.294,24.439,25.294,20.835z" />
                </g>
              </svg>
              <span>{newsInfo.location}</span>
            </h3> */}
            <p className="text-black text-base">
              <strong className="font-bold text-black text-xs">
                Description
              </strong>
            </p>
            <div
              className="blogInfo mb-3"
              dangerouslySetInnerHTML={{ __html: newsInfo.description }}
            ></div>
            {newsInfo.link && (
              <a
                href={newsInfo.link}
                className="bg-orange text-white py-1 px-4 cursor-pointer"
                target="_blank"
              >
                View Details
              </a>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default NewsDetails;
