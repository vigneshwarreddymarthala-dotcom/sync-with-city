"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { Creator } from "@/models/creator.model";

export default function AdmRestaurant({ params }: { params: { id: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [resInfo, setResInfo] = useState<Creator>();

  useEffect(() => {
    if (localStorage.getItem("LogInASCCTkn")) {
      setAuthToken(localStorage.getItem("LogInASCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRestaurant = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/admin/${params.id}`;
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

        if (res.status == 200) setResInfo(rInfo);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRestaurant();
  }, [authToken, params.id]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    <>
      <Notify />
      {resInfo && (
        <>
          <div className="relative">
            {resInfo.rLogo && (
              <Image
                src={getImgPath(resInfo.rLogo)}
                alt={resInfo.rName}
                width={300}
                height={250}
                className="w-full h-auto object-cover object-center rounded mb-3"
              />
            )}
          </div>

          <h2 className="font-semibold text-3xl text-orange">
            {resInfo.rName}
          </h2>
          <p className="text-black text-base">{resInfo.description}</p>
          <h3 className="my-4 font-medium flex gap-2 items-center">
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
            <span>{resInfo.location}</span>
          </h3>
          <h3 className="my-4 font-medium flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 247 247"
              className="w-5 h-5 fill-orange"
            >
              <circle cx="123.18" cy="62.73" r="61.69" />
              <path d="M11.62,208.15s-4.51-71.27,34.86-90.1c0,0,.51-.24,1.39-.6a30.18,30.18,0,0,1,28.4,3C88.9,129,116,143.35,144,132.68a121.44,121.44,0,0,0,26.3-13.38l2.36-1.38a23.68,23.68,0,0,1,17.79-2.66,20.38,20.38,0,0,1,2.41.77c8.1,3.11,32.84,6.69,40.93,65.2,0,0,13.38,61.31-34.86,64.73H47.1S12.87,245.34,11.62,208.15Z" />
            </svg>

            {resInfo.ownerName}
          </h3>
          {/* <h3 className="my-4 font-medium flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-orange"
            >
              <path
                fillRule="evenodd"
                d="M13,11.4226497 L13,7 C13,6.448 12.552,6 12,6 C11.448,6 11,6.448 11,7 L11,11.9888376 C10.998236,12.1652918 11.043253,12.339672 11.1300028,12.4931377 C11.2274619,12.6587312 11.3559711,12.7849072 11.509667,12.8716066 L15.830127,15.3660254 C16.308173,15.6420254 16.9201524,15.478046 17.1961524,15 C17.4721524,14.521954 17.308173,13.9099746 16.830127,13.6339746 L13,11.4226497 Z M12,2 C17.5229861,2 22,6.47701386 22,12 C22,17.5229861 17.5229861,22 12,22 C6.47701386,22 2,17.5229861 2,12 C2,6.47701386 6.47701386,2 12,2 Z"
              />
            </svg>
            {resInfo.openingHr}
          </h3> */}
        </>
      )}
      {!resInfo && (
        <ul className="m-0 p-0 list-none">
          <li className="bg-gray bg-opacity-35 shadow-md text-black transition px-4 md:px-8 py-5 rounded-md gap-6 my-3">
            <h3 className="text-center font-semibold text-2xl text-orange">
              Owner Not Yet Add Creator Info!
            </h3>
          </li>
        </ul>
      )}
    </>
  );
}
