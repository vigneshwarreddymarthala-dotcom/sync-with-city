"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { format } from "date-fns";
import { Conversation } from "@/models/message.model";
import Link from "next/link";

export default function RMessages() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [cnvList, setCnvList] = useState<Conversation[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getCnv = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/restaurant`;
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

        if (res.status == 200) setCnvList(rInfo);
        else {
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getCnv();
  }, [authToken]);

  useEffect(() => {
    const upMsgNotify = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}notify/message/restaurant`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rMsg = await res.json();
    };

    if (authToken) upMsgNotify();
  }, [authToken]);

  return (
    <>
      <Notify />
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Conversation List
        </h2>
        {cnvList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {cnvList.map((msg: Conversation, i: number) => {
              return (
                <li
                  key={i}
                  className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md my-3 cursor-pointer flex items-center justify-between gap-2"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      <small className="text-orange text-xs">Message to:</small>
                      <br />
                      {msg.usrName}
                    </h3>
                    {msg.lastMsg != undefined && (
                      <p className="text-xs text-black">
                        <strong className="text-darkGray">
                          Last Message On:
                        </strong>{" "}
                        {format(msg.lastMsg, "dd-MM-yyyy hh:mm a")}
                      </p>
                    )}
                    {msg.lastMsg == undefined && (
                      <p className="text-sm text-black">No Message Sent Yet!</p>
                    )}
                  </div>
                  <Link href={`/business/message/${msg._id}`}>
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="535.5px"
                      height="535.5px"
                      viewBox="0 0 535.5 535.5"
                      enableBackground="new 0 0 535.5 535.5"
                      className="w-8 h-8 fill-orange"
                    >
                      <g>
                        <g id="send">
                          <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 		" />
                        </g>
                      </g>
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {!cnvList ||
          (cnvList.length == 0 && (
            <h2 className="text-center font-medium mt-4">
              No Conversation Found!
            </h2>
          ))}
      </>
    </>
  );
}
