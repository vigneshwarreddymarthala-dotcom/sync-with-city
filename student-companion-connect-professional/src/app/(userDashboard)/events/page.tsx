"use client";

import { showToast } from "@/components/notify";
import PostModifyTab from "@/components/postModifyTab";
import PstNavigation from "@/components/pstNavigation";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [eList, setEList] = useState<REvent[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
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

  return (
    <>
      <PstNavigation />

      {eList.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {eList.map((event: REvent, i: number) => {
            return (
              <PostModifyTab
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
