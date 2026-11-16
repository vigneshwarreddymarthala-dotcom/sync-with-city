"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/notify";
import { Creator } from "@/models/creator.model";
import { BzInfo } from "@/models/info.model";
import InfoTab from "@/components/infoTab ";

export default function ViewEvent({ params }: { params: { usrId: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [eventList, setEventList] = useState<BzInfo[]>([]);

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

          const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/Year Events/${rInfo.rId}/0/12`;

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
        {eventList.length != 0 && (
          <>
            <ul className="m-0 p-0 list-none">
              {eventList.map((info: BzInfo, i: number) => {
                return <InfoTab key={i} info={info} />;
              })}
            </ul>
          </>
        )}
      </>
    )
  );
}
