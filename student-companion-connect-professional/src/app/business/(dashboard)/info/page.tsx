"use client";

import BzPstNavigation from "@/components/bzPstNavigation";
import InfoModifyTab from "@/components/infoModifyTab";
import { showToast } from "@/components/notify";
import { BzInfo } from "@/models/info.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [nList, setNList] = useState<BzInfo[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getNewsData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/0/12`;
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
        setNList(eInfo.data);
      }
    };

    if (authToken) getNewsData();
  }, [authToken]);

  const rmvNews = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/${id}`;
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
        const newList = nList.filter((item) => item._id !== id);
        setNList(newList);
        showToast(eInfo, "success");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <BzPstNavigation type="business" />
      <Link
        href="/business/info/add"
        className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
      >
        &larr; Create New Information
      </Link>
      {nList.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {nList.map((info: BzInfo, i: number) => {
            return (
              <InfoModifyTab
                type="business"
                info={info}
                rInfo={(id) => rmvNews(id)}
                key={i}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
