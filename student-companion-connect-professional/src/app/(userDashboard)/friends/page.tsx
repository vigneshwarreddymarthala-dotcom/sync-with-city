"use client";

import Notify, { showToast } from "@/components/notify";
import { friendship } from "@/models/friendship.model";
import { UserInfo } from "@/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyFriends = () => {
  const [myFriends, setMyFriends] = useState<friendship[]>([]);
  const [authToken, setAuthToken] = useState<any>("");
  const [myInfo, setMyInfo] = useState<UserInfo>();

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getMyInfo = async () => {
      const uEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const uOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };
      const uRes: any = await fetch(uEndpoint, uOptions);
      const pInfo: any = await uRes.json();

      if (uRes.status == 200) setMyInfo(pInfo);
    };

    if (authToken) getMyInfo();
  }, [authToken]);

  useEffect(() => {
    const getMyFriends = async () => {
      try {
        const frdEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}friend/collection/all`;
        const frdOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const frdRes: any = await fetch(frdEndpoint, frdOptions);
        const fInfo: any = await frdRes.json();
        setMyFriends(fInfo.data);
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getMyFriends();
  }, [authToken]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const startConversation = async (friend: friendship) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/restaurant`;
      const isFromMe = friend.fromUsrId == myInfo?._id;
      const targetUsrId = isFromMe ? friend.toUsrId : friend.fromUsrId;
      const targetUsrNm = isFromMe ? friend.toUsrNm : friend.fromUsrNm;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          rId: myInfo?._id,
          usrId: targetUsrId,
          rName: myInfo?.fullName || "Student",
          usrName: targetUsrNm,
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

  const activeFriends = Array.isArray(myFriends)
    ? myFriends.filter((bk: friendship) => bk.toUsrId == myInfo?._id || bk.fromUsrId == myInfo?._id)
    : [];

  return (
    <>
      <Notify />
      {activeFriends.length != 0 && (
        <ul className="m-0 p-0 list-none space-y-3">
          {activeFriends.map((bk: friendship, i: number) => {
            const isToMe = bk.toUsrId == myInfo?._id;
            const friendName = isToMe ? bk.fromUsrNm : bk.toUsrNm;
            const friendId = isToMe ? bk.fromUsrId : bk.toUsrId;
            const friendImg = isToMe ? bk.fromUsrImg : bk.toUsrImg;

            return (
              <li
                key={i}
                className="bg-white border border-slate-200/90 hover:border-orange/50 shadow-sm hover:shadow-md transition-all px-5 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {friendImg && friendImg !== "default-avatar.jpg" ? (
                    <Image
                      src={getImgPath(friendImg)}
                      alt={friendName}
                      width={64}
                      height={64}
                      className="size-14 object-cover object-center rounded-full border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="size-14 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-xl flex items-center justify-center shadow-sm">
                      {friendName ? friendName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{friendName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected Friend
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/friends/user/${friendId}`}
                    className="text-xs font-semibold text-slate-700 hover:text-orange px-3.5 py-2 rounded-lg border border-slate-200 hover:border-orange/40 bg-white transition"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => startConversation(bk)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-orange hover:bg-orange/90 px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                    Message & Chat
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {activeFriends.length == 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm my-4">
          <div className="text-4xl mb-3">🇮🇳 👋</div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Find Your First Friend from India!
          </h2>
          <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
            You haven't connected with friends yet. Connect with fellow Indian students from Telangana, Andhra Pradesh, Maharashtra, Karnataka, Kerala, Gujarat, Tamil Nadu, and more studying in Germany.
          </p>
          <Link
            href="/friends/all/-/-"
            className="inline-block bg-orange hover:bg-opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition text-sm"
          >
            🇮🇳 Explore Indian Students Now
          </Link>
        </div>
      )}
      {activeFriends.length != 0 && (
        <div className="text-center mt-6 mb-2">
          <Link
            href="/friends/all/-/-"
            className="inline-block bg-orange/10 text-orange border border-orange/30 hover:bg-orange hover:text-white font-semibold px-5 py-2 rounded-xl transition text-sm"
          >
            + Connect with More Indian Students 🇮🇳
          </Link>
        </div>
      )}
    </>
  );
};

export default MyFriends;
