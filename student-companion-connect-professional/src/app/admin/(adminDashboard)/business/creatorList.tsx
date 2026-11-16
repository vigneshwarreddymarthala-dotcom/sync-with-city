"use client";

import { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { CreatorLogin } from "@/models/creator.model";
import { safeFormat } from "@/utils/date";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatorList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [hotelList, setHotelList] = useState<CreatorLogin[]>([]);
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
    const getROwner = async () => {
      let offset: any = query.get("p") ? query.get("p") : 1;
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/${
        offset - 1
      }/${PAGE_SIZE}`;
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
          setHotelList(rInfo.data);
          setTotalItem(rInfo.total);
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getROwner();
  }, [authToken]);

  const activation = async (id: string, status: boolean) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/${id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify({ status: status }),
    };

    try {
      const res: any = await fetch(endpoint, options);
      const rInfo: any = await res.json();
      if (res.status == 202) {
        setHotelList((bk: CreatorLogin[]) =>
          bk.map((item: any) => {
            if (item._id === id) {
              return { ...item, status: status };
            }
            return item;
          })
        );
        showToast(rInfo, "success");
      } else showToast(rInfo, "error");
    } catch (e) {
      showToast(e, "error");
    }
  };

  const rmvOwner = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/${id}`;
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
          const newList = hotelList.filter((item) => item._id !== id);
          setHotelList(newList);
          showToast(rInfo, "success");
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
        Registered Business Owner
      </h2>
      {hotelList.length != 0 && (
        <>
          <div className="flex justify-center mt-3">
            <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
          </div>
          <ul className="m-0 p-0 list-none">
            {hotelList.map((rOwner: CreatorLogin, i: number) => {
              return (
                <li
                  key={i}
                  className="bg-gray bg-opacity-35 shadow-md text-black transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3"
                >
                  <div className="flex-initial w-2/3">
                    <h3 className="font-semibold text-2xl">
                      {rOwner.fullName}
                    </h3>
                    <h4 className="text-sm font-medium text-black">
                      {rOwner.usrEmail}
                    </h4>
                    <h4 className="text-xs mt-1 font-semibold">
                      Registered On:{" "}
                      <span className="font-semibold">
                        {safeFormat(rOwner.createdAt, "dd-MM-yyyy hh:mm a")}
                      </span>
                    </h4>
                    <h4 className="text-xs mt-1 font-semibold">
                      Account Type:{" "}
                      <span className="text-green mr-2">{rOwner.accType}</span>
                      Status:{" "}
                      <span className="text-green">
                        {rOwner.status && <>Active</>}{" "}
                        {!rOwner.status && <>Inactive</>}
                      </span>
                    </h4>
                  </div>
                  <div className="flex-initial w-1/3 text-center">
                    <div className="flex flex-col gap-1">
                      {rOwner.status && (
                        <>
                          <Link
                            href={`/admin/creators/${rOwner._id}`}
                            className="text-orange cursor-pointer hover:text-black transition"
                          >
                            View
                          </Link>
                          <a
                            onClick={() => activation(rOwner._id, false)}
                            className="text-orange cursor-pointer hover:text-black transition"
                          >
                            Block
                          </a>
                        </>
                      )}
                      {!rOwner.status && (
                        <a
                          onClick={() => activation(rOwner._id, true)}
                          className="text-orange cursor-pointer hover:text-black transition"
                        >
                          Activate
                        </a>
                      )}
                      <a
                        onClick={() => rmvOwner(rOwner._id)}
                        className="text-orange cursor-pointer hover:text-black transition"
                      >
                        Delete
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
      {!hotelList ||
        (hotelList.length == 0 && (
          <h2 className="text-center font-medium mt-4">
            No Business Registered Yet!
          </h2>
        ))}
    </>
  );
}
