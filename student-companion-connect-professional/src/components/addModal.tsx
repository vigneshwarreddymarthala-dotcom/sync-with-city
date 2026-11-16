"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AddModal = ({
  popState,
  popStatus,
}: {
  popState: boolean;
  popStatus: (status: boolean) => void;
}) => {
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    setShowPop(popState);
  }, [popState]);

  return (
    <section
      className={`${
        showPop ? "flex" : "hidden"
      } fixed top-0 left-0 right-0 bottom-0 z-40 bg-lDGray bg-opacity-50 justify-center items-center`}
    >
      <div
        className="absolute top-0 left-0 right-0 bottom-0 z-20"
        onClick={() => {
          setShowPop(false);
          popStatus(false);
        }}
      ></div>
      <aside className="w-72 p-5 bg-white relative z-30 rounded-md flex flex-col gap-4">
        <a
          onClick={() => {
            setShowPop(false);
            popStatus(false);
          }}
          className="absolute cursor-pointer -right-6 -top-6"
        >
          <svg
            width="165"
            height="165"
            viewBox="0 0 165 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
          >
            <path
              d="M82.5 154.688C122.368 154.688 154.688 122.368 154.688 82.5C154.688 42.6319 122.368 10.3125 82.5 10.3125C42.6319 10.3125 10.3125 42.6319 10.3125 82.5C10.3125 122.368 42.6319 154.688 82.5 154.688Z"
              fill="#F54768"
            />
            <path
              d="M53.3319 38.7477L38.7478 53.3318L111.668 126.252L126.252 111.668L53.3319 38.7477Z"
              fill="white"
            />
            <path
              d="M126.252 53.3319L111.668 38.7478L38.7478 111.668L53.3319 126.252L126.252 53.3319Z"
              fill="white"
            />
          </svg>
        </a>
        <Link
          href="/events/add"
          onClick={() => {
            setShowPop(false);
            popStatus(false);
          }}
          className="bg-black bg-opacity-80 w-full text-center font-medium text-white hover:bg-opacity-100 hover:bg-orange py-2 rounded-lg transition flex items-center gap-2 justify-center"
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 fill-white"
          >
            <path
              clipRule="evenodd"
              d="M4 2C2.34315 2 1 3.34315 1 5V15C1 16.6569 2.34315 18 4 18H6V21C6 21.3905 6.22734 21.7453 6.58214 21.9085C6.93694 22.0717 7.35428 22.0134 7.65079 21.7593L12.0366 18H20C21.6569 18 23 16.6569 23 15V5C23 3.34315 21.6569 2 20 2H4ZM5 5C4.44772 5 4 5.44772 4 6V14C4 14.5523 4.44772 15 5 15H12C12.5523 15 13 14.5523 13 14V6C13 5.44772 12.5523 5 12 5H5ZM14.5 7H19.5V5H14.5V7ZM19.5 15H14.5V13H19.5V15ZM14.5 11H19.5V9H14.5V11Z"
              fillRule="evenodd"
            />
          </svg>
          New Post
        </Link>
        <Link
          href="/events/add/other"
          onClick={() => {
            setShowPop(false);
            popStatus(false);
          }}
          className="bg-black bg-opacity-80 w-full text-center font-medium text-white hover:bg-opacity-100 hover:bg-orange py-2 rounded-lg transition flex items-center gap-2 justify-center"
        >
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 fill-white"
          >
            <path
              clipRule="evenodd"
              d="M4 2C2.34315 2 1 3.34315 1 5V15C1 16.6569 2.34315 18 4 18H6V21C6 21.3905 6.22734 21.7453 6.58214 21.9085C6.93694 22.0717 7.35428 22.0134 7.65079 21.7593L12.0366 18H20C21.6569 18 23 16.6569 23 15V5C23 3.34315 21.6569 2 20 2H4ZM5 5C4.44772 5 4 5.44772 4 6V14C4 14.5523 4.44772 15 5 15H12C12.5523 15 13 14.5523 13 14V6C13 5.44772 12.5523 5 12 5H5ZM14.5 7H19.5V5H14.5V7ZM19.5 15H14.5V13H19.5V15ZM14.5 11H19.5V9H14.5V11Z"
              fillRule="evenodd"
            />
          </svg>
          Post For Other City
        </Link>
        <Link
          href="/news/add"
          onClick={() => {
            setShowPop(false);
            popStatus(false);
          }}
          className="bg-black bg-opacity-80 w-full text-center font-medium text-white hover:bg-opacity-100 hover:bg-orange py-2 rounded-lg transition flex items-center gap-2 justify-center"
        >
          <svg
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 fill-white"
          >
            <path d="M7.5 61.9H1.5C0.9 61.9 0.5 62.3 0.5 62.9C0.5 63.5 0.9 63.9 1.5 63.9H7.5C8.1 63.9 8.5 63.5 8.5 62.9C8.5 62.3 8.1 61.9 7.5 61.9Z" />
            <path d="M11.5 61.9H10.5C9.9 61.9 9.5 62.3 9.5 62.9C9.5 63.5 9.9 63.9 10.5 63.9H11.5C12.1 63.9 12.5 63.5 12.5 62.9C12.5 62.3 12.1 61.9 11.5 61.9Z" />
            <path d="M63.5 4.90002H62.5V3.90002C62.5 3.30002 62.1 2.90002 61.5 2.90002C60.9 2.90002 60.5 3.30002 60.5 3.90002V4.90002H59.5C58.9 4.90002 58.5 5.30002 58.5 5.90002C58.5 6.50002 58.9 6.90002 59.5 6.90002H60.5V7.90002C60.5 8.50002 60.9 8.90002 61.5 8.90002C62.1 8.90002 62.5 8.50002 62.5 7.90002V6.90002H63.5C64.1 6.90002 64.5 6.50002 64.5 5.90002C64.5 5.30002 64.1 4.90002 63.5 4.90002Z" />
            <path d="M55.4999 17.2001V48.9001C55.4999 52.2001 52.7999 54.9001 49.4999 54.9001H14.3999L16.0999 62.9001C16.2999 64.0001 17.3999 64.7001 18.4999 64.4001L61.4999 55.3001C62.5999 55.1001 63.2999 54.0001 62.9999 52.9001L55.4999 17.2001Z" />
            <path d="M36.5 38.9V33.4C35.5 34.3 34.7 36.3 34.5 38.9H36.5Z" />
            <path d="M38.5 46.4C39.5 45.5 40.3 43.5 40.5 40.9H38.5V46.4Z" />
            <path d="M38.5 38.9H40.5C40.3 36.3 39.5 34.3 38.5 33.4V38.9Z" />
            <path d="M30.6001 38.9H32.5001C32.6001 37 33.0001 35.4 33.6001 34.1C32.0001 35.1 30.9001 36.9 30.6001 38.9Z" />
            <path d="M36.5 46.4V40.9H34.5C34.7 43.5 35.5 45.5 36.5 46.4Z" />
            <path d="M30.6001 40.9C30.9001 42.9 32.0001 44.6 33.7001 45.7C33.1001 44.4 32.7001 42.7 32.6001 40.9H30.6001Z" />
            <path d="M41.3999 45.7C42.9999 44.6 44.1999 42.9 44.4999 40.9H42.5999C42.3999 42.7 41.9999 44.4 41.3999 45.7Z" />
            <path d="M41.3999 34C41.9999 35.3 42.3999 37 42.4999 38.8H44.3999C44.0999 36.9 42.9999 35.1 41.3999 34Z" />
            <path d="M48.5 7.90002H6.5V17.9H48.5V7.90002Z" />
            <path d="M5.5 52.9H49.5C51.7 52.9 53.5 51.1 53.5 48.9V3.70002L50.2 0.400024L47 3.70002L43.7 0.400024L40.4 3.70002L37.1 0.400024L34 3.70002L30.7 0.400024L27.4 3.70002L24.1 0.400024L21 3.70002L17.7 0.400024L14.4 3.70002L11.1 0.400024L8 3.70002L4.8 0.500024L1.5 3.70002V48.8C1.5 51.1 3.3 52.9 5.5 52.9ZM37.5 48.9C32.5 48.9 28.5 44.9 28.5 39.9C28.5 34.9 32.5 30.9 37.5 30.9C42.5 30.9 46.5 34.9 46.5 39.9C46.5 44.9 42.5 48.9 37.5 48.9ZM4.5 6.90002C4.5 6.30002 4.9 5.90002 5.5 5.90002H49.5C50.1 5.90002 50.5 6.30002 50.5 6.90002V18.9C50.5 19.5 50.1 19.9 49.5 19.9H5.5C4.9 19.9 4.5 19.5 4.5 18.9V6.90002ZM5.5 22.9H49.5C50.1 22.9 50.5 23.3 50.5 23.9C50.5 24.5 50.1 24.9 49.5 24.9H5.5C4.9 24.9 4.5 24.5 4.5 23.9C4.5 23.3 4.9 22.9 5.5 22.9ZM5.5 26.9H49.5C50.1 26.9 50.5 27.3 50.5 27.9C50.5 28.5 50.1 28.9 49.5 28.9H5.5C4.9 28.9 4.5 28.5 4.5 27.9C4.5 27.3 4.9 26.9 5.5 26.9ZM5.5 30.9H25.5C26.1 30.9 26.5 31.3 26.5 31.9C26.5 32.5 26.1 32.9 25.5 32.9H5.5C4.9 32.9 4.5 32.5 4.5 31.9C4.5 31.3 4.9 30.9 5.5 30.9ZM5.5 34.9H25.5C26.1 34.9 26.5 35.3 26.5 35.9C26.5 36.5 26.1 36.9 25.5 36.9H5.5C4.9 36.9 4.5 36.5 4.5 35.9C4.5 35.3 4.9 34.9 5.5 34.9ZM5.5 38.9H25.5C26.1 38.9 26.5 39.3 26.5 39.9C26.5 40.5 26.1 40.9 25.5 40.9H5.5C4.9 40.9 4.5 40.5 4.5 39.9C4.5 39.3 4.9 38.9 5.5 38.9ZM5.5 42.9H25.5C26.1 42.9 26.5 43.3 26.5 43.9C26.5 44.5 26.1 44.9 25.5 44.9H5.5C4.9 44.9 4.5 44.5 4.5 43.9C4.5 43.3 4.9 42.9 5.5 42.9ZM5.5 46.9H25.5C26.1 46.9 26.5 47.3 26.5 47.9C26.5 48.5 26.1 48.9 25.5 48.9H5.5C4.9 48.9 4.5 48.5 4.5 47.9C4.5 47.3 4.9 46.9 5.5 46.9Z" />
          </svg>
          Create News
        </Link>
      </aside>
    </section>
  );
};

export default AddModal;
