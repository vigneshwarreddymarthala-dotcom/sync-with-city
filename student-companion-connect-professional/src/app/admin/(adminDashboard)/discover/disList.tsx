"use client";

import Notify, { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { Discover } from "@/models/discover.model";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DiscoverAPg() {
  const [authToken, setAuthToken] = useState<any>("");
  const [disList, setDisList] = useState<Discover[]>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [pgOffset, setPgOffset] = useState(0);

  const query = useSearchParams();

  const PAGE_SIZE = 18;

  useEffect(() => {
    if (localStorage.getItem("LogInASCCTkn")) {
      setAuthToken(localStorage.getItem("LogInASCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getUsrEvent = async () => {
      let offset: any = query.get("p") ? query.get("p") : 1;
      const endpoint = `${
        process.env.NEXT_PUBLIC_API_Discover_PATH
      }discover/admin/${offset - 1}/${PAGE_SIZE}`;
      setPgOffset(offset - 1);
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();

        if (res.status == 200) {
          setDisList(rInfo.data);
          setTotalItem(rInfo.total);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getUsrEvent();
  }, [authToken, query]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_Discover_PATH}uploads/${img}`;
  };

  const rmvUser = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_Discover_PATH}discover/${id}`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();
        if (res.status == 200) {
          const newList = disList.filter((item) => item._id !== id);
          setDisList(newList);
          showToast(rInfo, "success");
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <Notify />
      <>
        <div className="my-5">
          <Link
            href="/admin/discover/add"
            className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
          >
            Create New &rarr;
          </Link>
        </div>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Discover List
        </h2>
        {disList.length != 0 && (
          <>
            <div className="flex justify-center mt-3">
              <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
            </div>
            <ul className="m-0 p-0 list-none flex flex-wrap">
              {disList.map((dis: Discover, i: number) => {
                return (
                  <li className="w-1/2 p-4" key={i}>
                    <div className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition rounded-md cursor-pointer pt-2 relative">
                      <Image
                        src={getImgPath(dis.imgPath[0])}
                        alt={dis.dName}
                        width={100}
                        height={100}
                        loading="lazy"
                        className="w-full h-40 object-contain object-center "
                      />
                      <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-white text-center">
                        <h3 className="font-semibold text-base py-1 px-2 mt-1">
                          {dis.dName} | {dis.location}
                        </h3>
                        <a
                          onClick={() => rmvUser(dis._id)}
                          className="text-orange cursor-pointer hover:text-black transition font-medium"
                        >
                          Remove
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-center">
              <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
            </div>
          </>
        )}
        {!disList ||
          (disList.length == 0 && (
            <h2 className="text-center font-medium mt-4">
              No Discover added Yet!
            </h2>
          ))}
      </>
    </>
  );
}
