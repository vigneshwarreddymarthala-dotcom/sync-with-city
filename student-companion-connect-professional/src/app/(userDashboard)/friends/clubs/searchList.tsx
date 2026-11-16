"use client";

import Notify, { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { Creator } from "@/models/creator.model";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";
import ClubTab from "@/components/clubTab";

const ClubSearchPg = () => {
  const [authToken, setAuthToken] = useState<any>("");
  const [usrList, setUsrList] = useState<Creator[]>([]);
  const [myInfo, setMyInfo] = useState<Creator>();
  const [location, setLocation] = useState<any>(locList.location[0]);
  const [pgOffset, setPgOffset] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const query = useSearchParams();

  const PAGE_SIZE = 18;

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }

    if (localStorage.getItem("locationClub")) {
      setLocation(localStorage.getItem("locationClub"));
    }
  }, []);
  useEffect(() => {
    const usrSearch = async () => {
      try {
        let offset: any = query.get("p") ? query.get("p") : 1;
        const endpoint = `${
          process.env.NEXT_PUBLIC_API_PATH
        }creator/Club/${location}/${offset - 1}/${PAGE_SIZE}`;
        setPgOffset(offset - 1);
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();
        if (res.status == 200 && rInfo?.data) {
          setUsrList(Array.isArray(rInfo.data) ? rInfo.data : []);
          setTotalItem(rInfo.total || 0);
        } else {
          setUsrList([]);
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) usrSearch();
  }, [query, authToken, location]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const chLocation = async (log: string) => {
    try {
      localStorage.setItem("locationClub", log);
      setLocation(log);
      window.location.reload();
    } catch (e) {
      showToast(e, "error");
    }
  };

  return (
    <>
      <Notify />
      <h2 className="text-center font-semibold text-base md:text-xl flex items-center justify-center bg-white py-1 shadow-sm text-black text-opacity-80">
        Clubs in{" "}
        <select
          className="w-auto bg-white bg-opacity-0 border border-none text-base md:text-xl text-orange rounded outline-none px-2 py-1"
          value={location}
          onChange={(e) => chLocation(e.target.value)}
        >
          <option value="" disabled>
            Select Your Location
          </option>
          {locList.location.map((loc: string, i: number) => {
            return (
              <option key={i} value={loc}>
                {loc}
              </option>
            );
          })}
        </select>
      </h2>
      {Array.isArray(usrList) && usrList.length != 0 && (
        <>
          <ul className="m-0 p-0 list-none">
            {usrList.map((club: Creator, i: number) => {
              return <ClubTab club={club} key={i} />;
            })}
          </ul>
          <div className="flex justify-center">
            <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
          </div>
        </>
      )}
      {(!usrList || usrList.length == 0) && (
        <h2 className="text-center font-medium mt-4">No Club Found!</h2>
      )}
    </>
  );
};

export default ClubSearchPg;
