"use client";

import BzPstNavigation from "@/components/bzPstNavigation";
import { showToast } from "@/components/notify";
import PostModifyTabBz from "@/components/postModifyTabBz";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [eList, setEList] = useState<REvent[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getEventData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/0/12`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const eInfo: any = await res.json();
      if (res.status == 200) {
        setEList(eInfo.data);
      }
    };

    if (authToken) getEventData();
  }, [authToken]);

  const rmvEvent = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const eInfo: any = await res.json();
        const newList = eList.filter((item) => item._id !== id);
        setEList(newList);
        showToast(eInfo, "success");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  return (
    <>
      <BzPstNavigation type="business" />
      <div className="my-5">
        <Link
          href="/business/events/add"
          className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
        >
          &larr; Create New Post/Offer
        </Link>
      </div>
      {eList.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {eList.map((event: REvent, i: number) => {
            return (
              <PostModifyTabBz
                type="business"
                event={event}
                key={i}
                rEvent={(id) => rmvEvent(id)}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
