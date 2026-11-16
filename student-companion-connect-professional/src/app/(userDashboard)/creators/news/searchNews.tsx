"use client";

import Image from "next/image";
import restaurantImg from "../../../../../public/images/get-companion.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { News } from "@/models/news.model";
import NewsSearch from "@/components/newsSearch";
import UsrHomeMenu from "@/components/userHomeMenu";

export default function SearchNews({
  loc,
  cate,
}: {
  loc: string;
  cate: string;
}) {
  const [authToken, setAuthToken] = useState<any>("");
  const router = useRouter();
  const [hotelList, setHotelList] = useState<News[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}news/${cate}/${loc}/0/120`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: any = await res.json();

      if (res.status == 200) {
        setHotelList(rInfo.data);
      }
    };

    if (authToken && loc && cate) getRData();
  }, [authToken, loc, cate]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const viewNews = (id: string) => {
    router.push(`/news/${id}`);
  };

  return (
    <>
      {/* <Image
          src={restaurantImg}
          alt="Creator"
          width={500}
          height={300}
          className="w-full h-auto"
          loading="lazy"
        />
        <hr className="mt-5 border-gray" /> */}
      <UsrHomeMenu />

      <NewsSearch />

      {hotelList.length != 0 && (
        <ul className="m-0 p-0 list-none flex flex-wrap">
          {hotelList.map((event: News, i: number) => {
            return (
              <li
                key={i}
                className="bg-gray w-full bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md my-3"
              >
                {event.newsImg && (
                  <Image
                    src={getImgPath(event.newsImg)}
                    alt=""
                    width={400}
                    height={400}
                    onClick={() => viewNews(event._id)}
                    className="w-full h-auto object-cover object-center rounded-md cursor-pointer"
                  />
                )}
                <div className="mt-3">
                  <h3 className="font-semibold text-xl text-orange leading-none">
                    {event.newsTitle}
                  </h3>
                  <div
                    className="blogInfo mb-3"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  ></div>
                  {event.link && (
                    <a
                      href={event.link}
                      className="bg-orange text-white py-1 px-4 cursor-pointer"
                      target="_blank"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {hotelList.length == 0 && (
        <h2 className="text-center font-medium mt-4">No News Available!</h2>
      )}
    </>
  );
}
