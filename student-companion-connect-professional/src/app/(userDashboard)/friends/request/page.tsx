"use client";

import Notify, { showToast } from "@/components/notify";
import { friendship } from "@/models/friendship.model";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FrdRequests = () => {
  const [myRequest, setMyRequest] = useState<friendship[]>([]);
  const [authToken, setAuthToken] = useState<any>("");
  const router = useRouter();

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
        setMyRequest(Array.isArray(fInfo.data) ? fInfo.data : []);
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

  const startConversation = async (friend: friendship) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/restaurant`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          rId: friend.toUsrId,
          usrId: friend.fromUsrId,
          rName: friend.toUsrNm || "Student",
          usrName: friend.fromUsrNm,
        }),
      };

      const res = await fetch(endpoint, options);
      const cInfo = await res.json();

      if (res.status == 202) {
        router.push(`/message/${cInfo}`);
      } else {
        showToast(cInfo, "error");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };

  return (
    <>
      <Notify />
      {myRequest.length != 0 && (
        <ul className="m-0 p-0 list-none space-y-3">
          {myRequest.map((bk: friendship, i: number) => {
            const isAccepted = bk.status === "Accepted";

            return (
              <li
                key={i}
                className="bg-white border border-slate-200/90 hover:border-orange/50 shadow-sm hover:shadow-md transition-all px-5 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {bk.fromUsrImg && bk.fromUsrImg !== "default-avatar.jpg" ? (
                    <Image
                      src={getImgPath(bk.fromUsrImg)}
                      alt={bk.fromUsrNm}
                      width={64}
                      height={64}
                      className="size-14 object-cover object-center rounded-full border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="size-14 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-xl flex items-center justify-center shadow-sm">
                      {bk.fromUsrNm ? bk.fromUsrNm.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{bk.fromUsrNm}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                          <span className="size-1.5 rounded-full bg-emerald-500"></span>
                          Friend Request Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Incoming Friend Request
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/friends/user/${bk.fromUsrId}`}
                    className="text-xs font-semibold text-slate-700 hover:text-orange px-3.5 py-2 rounded-lg border border-slate-200 hover:border-orange/40 bg-white transition"
                  >
                    View Profile
                  </Link>

                  {!isAccepted && (
                    <button
                      onClick={() => acceptFrd(bk._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-orange hover:bg-orange/90 px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Accept Request
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => startConversation(bk)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                      </svg>
                      Message & Chat
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {myRequest.length == 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm my-4">
          <div className="text-4xl mb-3">📬</div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            No Pending Friend Requests
          </h2>
          <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
            You don't have any pending requests right now. Discover other Indian students studying in Germany and send them friend requests!
          </p>
          <Link
            href="/friends/all/-/-"
            className="inline-block bg-orange hover:bg-opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition text-sm"
          >
            🇮🇳 Explore Indian Students
          </Link>
        </div>
      )}
    </>
  );
};

export default FrdRequests;
