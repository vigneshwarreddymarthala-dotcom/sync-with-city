"use client";

import BzStoreNavigation from "@/components/bzStoreNavigation";
import { showToast } from "@/components/notify";
import StoreModifyTab from "@/components/storeModifyTab";
import { Product } from "@/models/store.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [eList, setEList] = useState<Product[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getEventData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/0/12`;
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
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/${id}`;
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
      <BzStoreNavigation type="business" />
      <div className="my-5">
        <Link
          href="/business/store/add"
          className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
        >
          &larr; Create New Product
        </Link>
      </div>
      {eList.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {eList.map((pro: Product, i: number) => {
            return (
              <StoreModifyTab
                type="business"
                pro={pro}
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
