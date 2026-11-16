"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { BookingFrm } from "@/models/booking.model";
import { isBefore } from "date-fns";
import Link from "next/link";
import PstNavigation from "@/components/pstNavigation";
import BkModifyTab from "@/components/bkModifyTab";

export default function MyBookings() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [eventList, setEventList] = useState<BookingFrm[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getBkEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/user/0/10`;
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
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getBkEvent();
  }, [authToken]);

  const eventDetails = (rId: string, eId: string, type: string) => {
    router.push(
      `/creators/${rId}/${type == "offer" ? "offers" : "events"}/${eId}`
    );
  };

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
        <PstNavigation />
        {eventList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {eventList.map((bk: BookingFrm, i: number) => {
              return (
                <BkModifyTab
                  bk={bk}
                  rEvent={(id) => cancelBooking(id)}
                  key={i}
                />
              );
            })}
          </ul>
        )}
        {!eventList ||
          (eventList.length == 0 && (
            <h2 className="text-center font-medium mt-4">
              Not Yet Booked for Any Post!
            </h2>
          ))}
      </>
    </>
  );
}
