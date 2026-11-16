"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { format } from "date-fns";
import { Conversation } from "@/models/message.model";
import Link from "next/link";
import ConversationTab from "@/components/conversationTab";

export default function RMessages() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [cnvList, setCnvList] = useState<Conversation[]>([]);
  const [usrId, setUsrId] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getCnv = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/user`;
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
          setCnvList(rInfo);
          const usrEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
          const usrOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authToken,
            },
          };

          const uRes: any = await fetch(usrEndpoint, usrOptions);
          const uInfo: any = await uRes.json();

          setUsrId(uInfo._id);
        } else {
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
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}notify/message/user`;
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
          My Conversations
        </h2>

        {cnvList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {cnvList.map((msg: Conversation, i: number) => {
              return <ConversationTab msg={msg} usrId={usrId} key={i} />;
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
