"use client";

import Notify, { showToast } from "@/components/notify";
import { friendship } from "@/models/friendship.model";
import { UserInfo } from "@/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FrdRequests = () => {
  const [myRequest, setMyRequest] = useState<friendship[]>([]);
  const [authToken, setAuthToken] = useState<any>("");

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const frdRequest = async () => {
      try {
        const frdEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}friend/request/0/50`;
        const frdOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const frdRes: any = await fetch(frdEndpoint, frdOptions);
        const fInfo: any = await frdRes.json();
        setMyRequest(fInfo.data);
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) frdRequest();
  }, [authToken]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const acceptFrd = async (id: string) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}friend/request/accept/${id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          status: "Accepted",
        }),
      };

      const frdRes: any = await fetch(endpoint, options);
      const fInfo: any = await frdRes.json();
      if (frdRes.status == 202) {
        showToast(fInfo, "success");
        setMyRequest((bk: friendship[]) =>
          bk.map((item: any) => {
            if (item._id === id) {
              return { ...item, status: "Accepted" };
            }
            return item;
          })
        );
      } else showToast(fInfo, "error");
    } catch (e) {
      showToast(e, "error");
    }
  };

  return (
    <>
      <Notify />
      {myRequest.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {myRequest.map((bk: friendship, i: number) => {
            return (
              <li
                key={i}
                className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
              >
                {bk.fromUsrImg && (
                  <Image
                    src={getImgPath(bk.fromUsrImg)}
                    alt={bk.fromUsrNm}
                    width={100}
                    height={100}
                    className="size-24 object-cover object-center rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-2xl">{bk.fromUsrNm}</h3>
                  <h4 className="text-sm font-medium text-black">
                    Status: {bk.status}
                  </h4>

                  <div className="flex gap-3 mt-2">
                    <Link
                      href={`/friends/user/${bk.fromUsrId}`}
                      className="text-orange font-medium"
                    >
                      View Profile
                    </Link>
                    {bk.status == "Pending" && (
                      <a
                        onClick={() => acceptFrd(bk._id)}
                        className="text-orange font-medium"
                      >
                        Accept
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {myRequest.length == 0 && (
        <h2 className="text-center font-medium">No Friend Request Found!</h2>
      )}
    </>
  );
};

export default FrdRequests;
