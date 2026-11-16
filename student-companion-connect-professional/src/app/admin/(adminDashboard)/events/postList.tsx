"use client";

import { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [eventList, setEventList] = useState<REvent[]>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [pgOffset, setPgOffset] = useState(0);

  const query = useSearchParams();

  const PAGE_SIZE = 18;

  useEffect(() => {
    if (localStorage.getItem("LogInASCCTkn")) {
      setAuthToken(localStorage.getItem("LogInASCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      try {
        let offset: any = query.get("p") ? query.get("p") : 1;
        const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/admin/${
          offset - 1
        }/${PAGE_SIZE}`;
        setPgOffset(offset - 1);
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const eRes: any = await fetch(eEndpoint, options);
        const eInfo: any = await eRes.json();

        if (eRes.status == 200) {
          setEventList(eInfo.data);
          setTotalItem(eInfo.total);
        } else {
          showToast(eInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, query]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  const rmvEvent = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/admin/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();
        if (res.status == 200) {
          const newList = eventList.filter((item) => item._id !== id);
          setEventList(newList);
          showToast(rInfo, "success");
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };
  return (
    <>
      <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
        Posts/Offers/Announcements
      </h2>
      {eventList.length == 0 && (
        <h2 className="text-center font-medium mt-4">No Post Found!</h2>
      )}
      {eventList.length != 0 && (
        <>
          <div className="flex justify-center mt-3">
            <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
          </div>
          <ul className="m-0 p-0 list-none">
            {eventList.map((event: REvent, i: number) => {
              return (
                <li
                  key={i}
                  className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-4 my-3 cursor-pointer"
                >
                  {event.eventImg && (
                    <Image
                      src={getImgPath(event.eventImg)}
                      alt=""
                      width={100}
                      height={100}
                      className="size-24 object-cover object-center rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-2xl">
                      {event.type == "offer" && (
                        <span className="text-xs font-medium bg-orange text-white px-2 rounded-md">
                          Offer
                        </span>
                      )}
                      {event.type == "post" && (
                        <span className="text-xs font-medium bg-orange text-white px-2 rounded-md">
                          Post
                        </span>
                      )}
                      {event.type == "announcement" && (
                        <span className="text-xs font-medium bg-orange text-white px-2 rounded-md">
                          Announcement
                        </span>
                      )}
                      <br />
                      {event.eventName}
                    </h3>
                    <h4 className="text-sm font-medium text-black">
                      {event.location}
                      <br />
                      <small className="text-xs font-semibold text-orange">
                        {event.date} | {event.time} | {event.duration}
                      </small>
                    </h4>
                    <h4 className="text-sm font-medium text-black">
                      Alloted Seats:{" "}
                      <span className="text-sm font-semibold text-orange">
                        {event.seats}
                      </span>
                    </h4>
                    <h4 className="text-sm font-medium text-black">
                      Booked Seats:{" "}
                      <span className="text-sm font-semibold text-orange">
                        {event.bookedSeats}
                      </span>
                    </h4>
                    <p>
                      <Link
                        href={`/admin/events/${event._id}`}
                        className="text-orange cursor-pointer hover:text-black transition font-medium"
                      >
                        View
                      </Link>
                      <a
                        onClick={() => rmvEvent(event._id)}
                        className="ml-5 text-orange cursor-pointer hover:text-black transition font-medium"
                      >
                        Remove
                      </a>
                    </p>
                  </div>
                  <h2 className="ml-auto text-2xl font-medium text-orange text-center min-w-28">
                    {event.seats > event.bookedSeats && (
                      <>&euro; {event.price}</>
                    )}

                    {event.seats <= event.bookedSeats && <>SOLD OUT</>}
                    {expireEvent(event.date, event.time) && (
                      <>
                        <br />
                        Expired
                      </>
                    )}
                  </h2>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-center">
            <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
          </div>
        </>
      )}
    </>
  );
}
