"use client";

import restaurantImg from "../../../../../public/images/get-companion.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import UsrHomeMenu from "@/components/userHomeMenu";
import PostTab from "@/components/postTab";

export default function Creators() {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<any>("");
  const router = useRouter();
  const [hotelList, setHotelList] = useState<REvent[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
      setLocation(localStorage.getItem("location"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}offer/location/${location}/0/12`;
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

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  const postVisible = (
    date: string,
    time: string,
    seats: number,
    bookedSeats: number
  ) => {
    if (!expireEvent(date, time)) {
      if (seats < bookedSeats || seats - bookedSeats == 0) {
        return false;
      } else return true;
    } else return false;
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

      {hotelList.length != 0 && (
        <ul className="m-0 p-0 list-none flex flex-wrap">
          {hotelList.map((event: REvent, i: number) => {
            return (
              postVisible(
                event.date,
                event.time,
                parseInt(event.seats),
                parseInt(event.bookedSeats)
              ) && (
                <PostTab
                  event={event}
                  key={i}
                  link={`/creators/${event.rId}/${
                    event.type == "offer" ? "offers" : "events"
                  }`}
                />
              )
            );
          })}
        </ul>
      )}
      {hotelList.length == 0 && (
        <h2 className="text-center font-medium mt-4">No Offer Available!</h2>
      )}
    </>
  );
}
