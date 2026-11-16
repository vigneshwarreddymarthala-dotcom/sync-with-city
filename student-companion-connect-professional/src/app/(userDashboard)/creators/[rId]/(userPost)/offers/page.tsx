"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/notify";
import { REvent } from "@/models/event.model";
import PostTab from "@/components/postTab";

export default function ViewEvent({ params }: { params: { rId: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<any>("");
  const [eventList, setEventList] = useState<REvent[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
      setLocation(localStorage.getItem("location"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      try {
        const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}offer/${params.rId}/0/12`;
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
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && location) getRData();
  }, [authToken, params.rId, location]);

  return (
    <>
      {eventList.length == 0 && (
        <h2 className="text-orange text-center font-medium text-xl">
          No Offers Hosted in {location}
        </h2>
      )}
      {eventList.length != 0 && (
        <>
          <h2 className="text-orange font-medium text-xl">
            Hosted Offers in {location}
          </h2>
          <ul className="m-0 p-0 list-none">
            {eventList.map((event: REvent, i: number) => {
              return (
                <PostTab
                  key={i}
                  event={event}
                  link={`/creators/${params.rId}/details/${event._id}`}
                />
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
