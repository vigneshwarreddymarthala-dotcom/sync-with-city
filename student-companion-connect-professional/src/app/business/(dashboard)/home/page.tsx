"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const RestaurantHome = () => {
  const [authToken, setAuthToken] = useState<any>("");
  const [userName, setUserName] = useState<any>("");
  const [msg, setMsg] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
      setUserName(localStorage.getItem("LogInRSCCFNm"));
    }
  }, []);

  useEffect(() => {
    const getMsgNotify = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}notify/message/restaurant`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rMsg = await res.json();

      if (res.status == 200) {
        setMsg(rMsg.msgNo);
      }
    };

    if (authToken) getMsgNotify();
  }, [authToken]);
  return (
    <>
      <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
        Welcome {userName}
      </h2>
      <div className="flex flex-wrap justify-center gap-2 mt-7">
        <Link
          href="/business/events"
          className="bg-orange w-1/3 rounded-lg p-5 flex justify-center items-center shadow-lg"
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 fill-white"
          >
            <path
              clipRule="evenodd"
              d="M4 2C2.34315 2 1 3.34315 1 5V15C1 16.6569 2.34315 18 4 18H6V21C6 21.3905 6.22734 21.7453 6.58214 21.9085C6.93694 22.0717 7.35428 22.0134 7.65079 21.7593L12.0366 18H20C21.6569 18 23 16.6569 23 15V5C23 3.34315 21.6569 2 20 2H4ZM5 5C4.44772 5 4 5.44772 4 6V14C4 14.5523 4.44772 15 5 15H12C12.5523 15 13 14.5523 13 14V6C13 5.44772 12.5523 5 12 5H5ZM14.5 7H19.5V5H14.5V7ZM19.5 15H14.5V13H19.5V15ZM14.5 11H19.5V9H14.5V11Z"
              fillRule="evenodd"
            />
          </svg>
        </Link>
        <Link
          href="/business/bookings"
          className="bg-orange w-1/3 rounded-lg p-5 flex justify-center items-center shadow-lg"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            className="fill-white w-16 h-16"
            width="459px"
            height="459px"
            viewBox="0 0 459 459"
            enableBackground="new 0 0 459 459"
          >
            <g>
              <g id="drive-form">
                <path
                  d="M408,0H51C22.95,0,0,22.95,0,51v357c0,28.05,22.95,51,51,51h357c28.05,0,51-22.95,51-51V51C459,22.95,436.05,0,408,0z
			 M153,357h-51v-51h51V357z M153,255h-51v-51h51V255z M153,153h-51v-51h51V153z M357,357H178.5v-51H357V357z M357,255H178.5v-51
			H357V255z M357,153H178.5v-51H357V153z"
                />
              </g>
            </g>
          </svg>
        </Link>
        <Link
          href="/business/message"
          className="relative bg-orange w-1/3 rounded-lg p-5 flex justify-center items-center shadow-lg"
        >
          {msg && (
            <span className="absolute w-2 h-2 rounded-full bg-red right-0 top-0"></span>
          )}
          <svg
            width="92"
            height="74"
            viewBox="0 0 92 74"
            className="w-16 h-16 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M33.7925 15.0455C52.4494 15.0455 67.5817 26.5752 67.5817 40.7958C67.5817 55.013 52.4494 66.5426 33.7925 66.5426C30.4983 66.5426 27.3194 66.1834 24.3099 65.5157C20.3345 72.7209 13.1225 74.3206 6.6731 72.7006C10.5604 69.3657 13.9156 66.2071 16.4337 62.8858C6.58837 58.3919 0 50.1768 0 40.7958C0 26.5752 15.1322 15.0455 33.7925 15.0455Z" />
            <path d="M58.2178 0.723267C46.6407 0.723267 36.4193 5.16296 30.3291 11.931C45.4444 7.87423 82.3346 24.1215 68.4088 51.2579C72.3876 58.463 78.8811 59.9949 85.3339 58.3749C81.4466 55.0435 78.088 51.8814 75.5699 48.5601C85.4085 44.0594 92.0002 35.8511 92.0002 26.4667C92.0002 12.2529 76.8781 0.723267 58.2178 0.723267Z" />
          </svg>
        </Link>
        {/* <Link
            href="/business/influencer"
            className="bg-orange w-1/3 rounded-lg p-5 flex justify-center items-center shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-16 h-16 fill-white"
            >
              <g>
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M1 22a8 8 0 1 1 16 0H1zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9.246-9.816A9.97 9.97 0 0 1 19 7a9.97 9.97 0 0 1-.754 3.816l-1.677-1.22A7.99 7.99 0 0 0 17 7a7.99 7.99 0 0 0-.43-2.596l1.676-1.22zm3.302-2.4A13.942 13.942 0 0 1 23 7c0 2.233-.523 4.344-1.452 6.216l-1.645-1.196A11.955 11.955 0 0 0 21 7c0-1.792-.393-3.493-1.097-5.02L21.548.784z" />
              </g>
            </svg>
          </Link> */}
        <Link
          href="/business/profile"
          className="bg-orange w-1/3 rounded-lg p-5 flex justify-center items-center shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 247 247"
            className="w-16 h-16 fill-white"
          >
            <circle cx="123.18" cy="62.73" r="61.69" />
            <path d="M11.62,208.15s-4.51-71.27,34.86-90.1c0,0,.51-.24,1.39-.6a30.18,30.18,0,0,1,28.4,3C88.9,129,116,143.35,144,132.68a121.44,121.44,0,0,0,26.3-13.38l2.36-1.38a23.68,23.68,0,0,1,17.79-2.66,20.38,20.38,0,0,1,2.41.77c8.1,3.11,32.84,6.69,40.93,65.2,0,0,13.38,61.31-34.86,64.73H47.1S12.87,245.34,11.62,208.15Z" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default RestaurantHome;
