"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showToast } from "@/components/notify";
import { REvent } from "@/models/event.model";
import { Creator } from "@/models/creator.model";
import PostTab from "@/components/postTab";

export default function ViewEvent({ params }: { params: { usrId: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [eventList, setEventList] = useState<REvent[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
      setLocation(localStorage.getItem("location"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/${params.usrId}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: Creator = await res.json();

        if (res.status == 200) {
          setRData(rInfo);

          const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/${rInfo.rId}/0/12`;

          const eRes: any = await fetch(eEndpoint, options);
          const eInfo: any = await eRes.json();

          if (eRes.status == 200) {
            setEventList(eInfo.data);
          }
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && location) getRData();
  }, [authToken, params.usrId, location]);

  return (
    rData && (
      <>
        {eventList.length == 0 && (
          <h2 className="text-orange text-center font-medium text-xl">
            No {rData.usrType == "Club" && "Posts"}{" "}
            {rData.usrType != "Club" && "Offers"} Hosted in {location}
          </h2>
        )}
        {eventList.length != 0 && (
          <>
            <h2 className="text-orange font-medium text-xl">
              Hosted {rData.usrType == "Club" && "Posts"}
              {rData.usrType != "Club" && "Offers"} in {location}
            </h2>
            <ul className="m-0 p-0 list-none">
              {eventList.map((event: REvent, i: number) => {
                return (
                  <PostTab
                    key={i}
                    event={event}
                    link={`/creators/${params.usrId}/details/${event._id}`}
                  />
                );
              })}
            </ul>
          </>
        )}
      </>
    )
  );
}
