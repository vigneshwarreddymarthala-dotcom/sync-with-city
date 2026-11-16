"use client";

import BookingTab from "@/components/bookingTab";
import Notify, { showToast } from "@/components/notify";
import { BookingFrm } from "@/models/booking.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookingList({ params }: { params: { id: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [eventList, setEventList] = useState<BookingFrm[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getBkEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/${params.id}/0/10`;
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

        if (res.status == 200) setEventList(rInfo.data);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getBkEvent();
  }, [authToken, params]);

  const cancelBooking = async (id: string) => {
    if (confirm("Are You Sure Want to Cancel?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/status/${id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      };

      try {
        const res: any = await fetch(endpoint, options);
        const bInfo: any = await res.json();

        if (res.status == 202) {
          showToast("Booking Cancelled!", "success");
          setEventList((bk: BookingFrm[]) =>
            bk.map((item: any) => {
              if (item._id === id) {
                return { ...item, status: "Cancelled" };
              }
              return item;
            })
          );
        } else showToast("Failed to Cancel Booking!", "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <Notify />
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Booking List for{" "}
          {eventList.length != 0 && <>{eventList[0].eventName}</>}
        </h2>

        {eventList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {eventList.map((bk: BookingFrm, i: number) => {
              return (
                <BookingTab
                  bk={bk}
                  key={i}
                  bCancel={(id: string) => cancelBooking(id)}
                />
              );
            })}
          </ul>
        )}
        {eventList.length == 0 && (
          <h2 className="text-center font-medium mt-4">No One Booked Yet!</h2>
        )}
        <div className="my-5">
          <Link
            href={`/events`}
            className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
          >
            &larr; Back to Posts
          </Link>
        </div>
      </>
    </>
  );
}
