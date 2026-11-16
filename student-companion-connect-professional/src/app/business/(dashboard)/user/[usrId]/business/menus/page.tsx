"use client";

import Notify, { showToast } from "@/components/notify";
import { Creator } from "@/models/creator.model";
import Image from "next/image";
import { useEffect, useState } from "react";

const MenuPage = ({ params }: { params: { usrId: string } }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [bigImg, setBigImg] = useState("");
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/${params.usrId}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: Creator = await res.json();

        if (res.status == 200) {
          setRData(rInfo);
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, params.usrId]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const popImg = (img: string) => {
    setPopup(true);
    setBigImg(img);
  };

  return (
    rData && (
      <>
        <>
          <Notify />
          {rData.menuList && rData.menuList.length != 0 && (
            <>
              <h2 className="text-orange font-medium text-xl">Our Photos</h2>
              <ul className="flex flex-wrap justify-center">
                {rData.menuList.map((img: string, i: number) => {
                  return (
                    <li key={i} className="w-1/3 sm:w-1/4 p-2">
                      <Image
                        src={getImgPath(img)}
                        alt="Food Menu"
                        width={250}
                        height={250}
                        className="w-full h-40 object-cover shadow-lg shadow-darkGray rounded-md cursor-pointer"
                        onClick={() => popImg(getImgPath(img))}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
        {popup && (
          <section className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <a
              className="absolute right-1 top-1 bg-white rounded-full cursor-pointer"
              onClick={() => setPopup(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                focusable="false"
                viewBox="0 0 12 12"
                className="w-8 h-8"
              >
                <path
                  fill="#D00000"
                  d="M5.5 1C2.46 1 0 3.46 0 6.5S2.46 12 5.5 12 11 9.54 11 6.5 8.54 1 5.5 1zm2.44 7.06c.24.24.24.64 0 .88-.12.12-.28.18-.44.18s-.32-.06-.44-.18L5.5 7.38 3.94 8.94c-.12.12-.28.18-.44.18s-.32-.06-.44-.18a.628.628 0 010-.88L4.62 6.5 3.06 4.94c-.24-.24-.24-.64 0-.88s.64-.24.88 0L5.5 5.62l1.56-1.56c.24-.24.64-.24.88 0s.24.64 0 .88L6.38 6.5l1.56 1.56z"
                />
              </svg>
            </a>
            <Image
              src={bigImg}
              alt="Restaurant Menu"
              width={650}
              height={650}
              loading="lazy"
              className="max-w-xl h-screen w-full object-contain object-center"
            />
          </section>
        )}
      </>
    )
  );
};

export default MenuPage;
