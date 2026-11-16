"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { Conversation, Messages } from "@/models/message.model";
import { useForm } from "react-hook-form";
import Link from "next/link";
import MessageTab from "@/components/messageTab";
import VoiceCalling from "@/components/voiceCalling";

export default function RMessages({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [usrId, setUsrId] = useState<string>("");
  const [cnv, setCnv] = useState<Conversation>();
  const [msgList, setMsgList] = useState<Messages[]>([]);
  const { register, handleSubmit, setValue, reset } = useForm<Messages>();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getCnv = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/user/${params.id}`;
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
          setCnv(rInfo);

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

          if (uInfo._id == rInfo.rId) {
            setValue("senderName", rInfo.rName);
          } else {
            setValue("senderName", rInfo.usrName);
          }
          setValue("cId", params.id);
        } else {
          showToast(rInfo, "error");
          router.back();
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getCnv();
  }, [authToken, setValue, params.id, router]);

  useEffect(() => {
    const section = document.getElementById("msgList");
    if (section) {
      section.scrollTop = section.scrollHeight;
    }
  });

  useEffect(() => {
    const getMsgList = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}message/user/${params.id}`;
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

        if (res.status == 200) setMsgList(rInfo.data);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && cnv) getMsgList();
  }, [authToken, cnv, params]);

  const getAllMsgList = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}message/user/${params.id}`;
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

      if (res.status == 200) setMsgList(rInfo.data);
      else {
        showToast(rInfo, "success");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };

  const sendMsg = async (data: Messages) => {
    if (!data.message || !data.message.trim()) return;
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}message/user`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          ...data,
          cId: data.cId || params.id,
          senderId: usrId,
          senderName: data.senderName || (cnv?.rId == usrId ? cnv?.rName : cnv?.usrName),
        }),
      };

      const res: any = await fetch(endpoint, options);
      const mInfo: any = await res.json();
      if (res.status == 202) {
        showToast(mInfo, "success");
        setValue("message", "");
        getAllMsgList();
      } else showToast(mInfo, "error");
    } catch (e) {
      showToast(e, "error");
    }
  };

  const handleStartCall = async () => {
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      setRoomUrl(data.url);
      setValue(
        "message",
        `Please join the call by following link: <a href="${data.url}" target="_blank">Join Call</a>`
      );
      handleSubmit(sendMsg)();
    } else {
      alert("Failed to create room");
    }
  };

  return (
    <>
      <Notify />
      {cnv && (
        <>
          <h2 className="text-xl font-medium text-orange text-center border-b-2 pb-2 border-orange flex items-center justify-center gap-3">
            Conversation With {cnv.rId == usrId ? cnv.usrName : cnv.rName}
            <Link
              href={`/user/${cnv.rId == usrId ? cnv.usrId : cnv.rId}`}
              className="bg-orange text-white px-2 rounded text-sm"
            >
              View Profile
            </Link>
          </h2>
          {msgList.length != 0 && (
            <ul
              id="msgList"
              className="m-0 p-0 list-none overflow-y-auto"
              style={{ maxHeight: "55vh" }}
            >
              {msgList.map((msg: Messages, i: number) => {
                return <MessageTab msg={msg} key={i} usrId={usrId} />;
              })}
            </ul>
          )}
          {!msgList ||
            (msgList.length == 0 && (
              <h2 className="text-center font-medium mt-4">
                No Message Sent Yet!
              </h2>
            ))}
          <div className="bottom-20 fixed w-full ">
            <form className="flex gap-2 w-full max-w-xl">
              <textarea
                {...register("message")}
                placeholder="Type a message... (Press Enter to send)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(sendMsg)();
                  }
                }}
                className="h-12 flex-1 p-2 outline-none border-orange border-2 rounded-md resize-none"
              ></textarea>
              <button
                type="submit"
                className="bg-orange py-3 px-4 rounded-md"
                onClick={handleSubmit(sendMsg)}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="535.5px"
                  height="535.5px"
                  viewBox="0 0 535.5 535.5"
                  enableBackground="new 0 0 535.5 535.5"
                  className="w-5 h-5 fill-white"
                >
                  <g>
                    <g id="send">
                      <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 		" />
                    </g>
                  </g>
                </svg>
              </button>
            </form>
            <div className="flex items-center gap-2 mt-2">
              <Link href="/message" className="text-orange font-medium ">
                &larr; Back to Messages
              </Link>
              {!roomUrl && (
                <a
                  onClick={handleStartCall}
                  className="bg-orange text-white font-medium py px-2 rounded cursor-pointer"
                >
                  Start Voice Calling
                </a>
              )}
              {roomUrl && (
                <a
                  onClick={() => setRoomUrl(null)}
                  className="bg-orange text-white font-medium py px-2 rounded cursor-pointer"
                >
                  End Call
                </a>
              )}
            </div>
          </div>
          {roomUrl && <VoiceCalling url={roomUrl} />}
        </>
      )}
    </>
  );
}
