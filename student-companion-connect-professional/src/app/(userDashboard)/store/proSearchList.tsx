"use client";

import { showToast } from "@/components/notify";
import StoreProfileTab from "@/components/storeProfileTab";
import { Creator } from "@/models/creator.model";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchProList = ({ loc, cate }: { loc: string; cate: string }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [proList, setProList] = useState<Creator[]>([]);
  const [pgOffset, setPgOffset] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const query = useSearchParams();

  const PAGE_SIZE = 18;

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const strSearch = async (loc: string) => {
      try {
        let offset: any = query.get("p") ? query.get("p") : 1;
        const endpoint = `${
          process.env.NEXT_PUBLIC_API_PATH
        }store/${loc}/${cate}/${offset - 1}/${PAGE_SIZE}`;
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
        setProList(Array.isArray(rInfo?.data) ? rInfo.data : (Array.isArray(rInfo) ? rInfo : []));
        setTotalItem(rInfo?.total || (Array.isArray(rInfo) ? rInfo.length : 0));
      } catch (e) {
        showToast(e, "error");
        setProList([]);
      }
    };

    if (authToken) strSearch(loc);
  }, [loc, cate, query, authToken]);
  return (
    <>
      <ul className="flex flex-wrap">
        {proList && proList.length > 0 ? (
          proList.map((pro: Creator, i: number) => {
            return <StoreProfileTab prof={pro} key={i} />;
          })
        ) : (
          <li className="w-full text-center py-8 text-black font-medium">
            No products found for this location/category.
          </li>
        )}
      </ul>
    </>
  );
};

export default SearchProList;
