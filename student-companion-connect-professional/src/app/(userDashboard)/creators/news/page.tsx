"use client";

import Image from "next/image";
import restaurantImg from "../../../../../public/images/get-companion.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { News } from "@/models/news.model";
import { format, isBefore } from "date-fns";
import Link from "next/link";
import NewsSearch from "@/components/newsSearch";
import UsrHomeMenu from "@/components/userHomeMenu";
import NewsTab from "@/components/newsTab";

export default function Creators() {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<any>("");

  const [hotelList, setHotelList] = useState<News[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
      setLocation(localStorage.getItem("location"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}news/user/0/120`;
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

    if (authToken && location) getRData();
  }, [authToken, location]);

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
          {hotelList.map((news: News, i: number) => {
            return <NewsTab key={i} news={news} />;
          })}
        </ul>
      )}
    </>
  );
}
