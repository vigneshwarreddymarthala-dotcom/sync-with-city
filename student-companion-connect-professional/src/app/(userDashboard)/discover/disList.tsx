"use client";

import { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { Discover } from "@/models/discover.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";
import UsrHomeMenu from "@/components/userHomeMenu";
import DiscoverTab from "@/components/discoverTab";

const DiscoverPg = () => {
  const [disList, setDisList] = useState<Discover[]>([]);
  const [location, setLocation] = useState<any>();
  const [totalItem, setTotalItem] = useState(0);
  const [pgOffset, setPgOffset] = useState(0);

  const query = useSearchParams();

  const PAGE_SIZE = 18;

  useEffect(() => {
    const loc = localStorage.getItem("locationDis") || localStorage.getItem("location") || "Stuttgart";
    setLocation(loc);
  }, []);

  useEffect(() => {
    const getRData = async () => {
      let offset: any = query.get("p") ? query.get("p") : 1;
      const endpoint = `${
        process.env.NEXT_PUBLIC_API_Discover_PATH
      }discover/${location}/${offset - 1}/${PAGE_SIZE}`;
      setPgOffset(offset - 1);
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: any = await res.json();

      if (res.status == 200) {
        setDisList(rInfo.data);
        setTotalItem(rInfo.total);
      } else {
        showToast(rInfo, "error");
      }
    };

    if (location) getRData();
  }, [location, query]);

  const chLocation = async (log: string) => {
    try {
      localStorage.setItem("locationDis", log);
      setLocation(log);
      window.location.reload();
    } catch (e) {
      showToast(e, "error");
    }
  };

  return (
    <>
      <UsrHomeMenu />
      <h2 className="text-center font-semibold text-base md:text-xl flex items-center justify-center bg-white py-1 shadow-sm text-black text-opacity-80">
        Discover in{" "}
        <select
          className="w-auto bg-white bg-opacity-0 border border-none text-base md:text-xl text-orange rounded outline-none px-3 py-1"
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

      {disList.length != 0 && (
        <ul className="m-0 p-0 list-none flex flex-wrap">
          {disList.map((dis: Discover, i: number) => {
            return <DiscoverTab dis={dis} key={i} />;
          })}
        </ul>
      )}
      <div className="flex justify-center">
        <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
      </div>
    </>
  );
};

export default DiscoverPg;
