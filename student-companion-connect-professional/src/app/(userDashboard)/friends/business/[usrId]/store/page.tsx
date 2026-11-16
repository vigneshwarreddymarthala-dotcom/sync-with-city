"use client";

import { showToast } from "@/components/notify";
import StoreTab from "@/components/storeTab";
import { Product } from "@/models/store.model";
import { useEffect, useState } from "react";

const StorePg = ({ params }: { params: { rId: string } }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [proList, setProList] = useState<Product[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/${params.rId}/0/50`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const pInfo: any = await res.json();

        if (res.status == 200) {
          setProList(pInfo.data);
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, params.rId]);

  return (
    <>
      <ul className="flex flex-wrap">
        {proList.map((pro: Product, i: number) => {
          return <StoreTab pro={pro} key={i} />;
        })}
      </ul>
    </>
  );
};

export default StorePg;
