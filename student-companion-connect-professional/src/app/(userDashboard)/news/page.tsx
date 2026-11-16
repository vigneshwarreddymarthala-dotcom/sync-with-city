"use client";

import NewsModifyTab from "@/components/newsModifyTab";
import { showToast } from "@/components/notify";
import PstNavigation from "@/components/pstNavigation";
import { News } from "@/models/news.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [nList, setNList] = useState<News[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getNewsData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}news/0/12`;
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
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}news/${id}`;
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
      <PstNavigation />

      {nList.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {nList.map((news: News, i: number) => {
            return (
              <NewsModifyTab news={news} rNews={(id) => rmvNews(id)} key={i} />
            );
          })}
        </ul>
      )}
    </>
  );
}
