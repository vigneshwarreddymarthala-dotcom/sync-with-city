"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { Order } from "@/models/booking.model";
import { Creator } from "@/models/creator.model";
import BzOrderTab from "@/components/bzOrderTab";
import StoreProTab from "@/components/storeProTab";

export default function MyOrders() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [eventList, setEventList] = useState<Order[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getBkEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}order/0/10`;
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

  const cancelBooking = async (id: string) => {
    if (confirm("Are You Sure Want to Cancel?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}order/status/${id}`;
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

        if (res.status == 200) {
          showToast("Booking Cancelled!", "success");
          setEventList((bk: Order[]) =>
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
        <StoreProTab />
        {eventList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {eventList.map((bk: Order, i: number) => {
              return (
                <BzOrderTab
                  type=""
                  bk={bk}
                  key={i}
                  isUsr={false}
                  authToken={authToken}
                  bCancel={(id: string) => cancelBooking(id)}
                />
              );
            })}
          </ul>
        )}
        {!eventList ||
          (eventList.length == 0 && (
            <h2 className="text-center font-medium mt-4">No Order Found!</h2>
          ))}
      </>
    </>
  );
}
