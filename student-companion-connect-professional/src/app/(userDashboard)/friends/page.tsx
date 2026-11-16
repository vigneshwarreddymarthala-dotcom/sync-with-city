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

  const startConversation = async (i: number) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/restaurant`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          usrId:
            myFriends[i].fromUsrId == myInfo?._id
              ? myFriends[i].toUsrId
              : myFriends[i].fromUsrId,
          rName: myInfo?.fullName,
          usrName:
            myFriends[i].fromUsrId == myInfo?._id
              ? myFriends[i].toUsrNm
              : myFriends[i].fromUsrNm,
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
      {myFriends.length != 0 && (
        <ul className="m-0 p-0 list-none">
          {myFriends.map((bk: friendship, i: number) => {
            return (
              <li
                key={i}
                className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
              >
                {bk.toUsrId == myInfo?._id && (
                  <>
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

                        <a
                          onClick={() => startConversation(i)}
                          className="text-orange hover:text-black transition cursor-pointer"
                        >
                          Message
                        </a>
                      </div>
                    </div>
                  </>
                )}
                {bk.fromUsrId == myInfo?._id && (
                  <>
                    {bk.toUsrImg && (
                      <Image
                        src={getImgPath(bk.toUsrImg)}
                        alt={bk.toUsrNm}
                        width={100}
                        height={100}
                        className="size-24 object-cover object-center rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-2xl">{bk.toUsrNm}</h3>
                      <h4 className="text-sm font-medium text-black">
                        Status: {bk.status}
                      </h4>

                      <div className="flex gap-3 mt-2">
                        <Link
                          href={`/friends/user/${bk.toUsrId}`}
                          className="text-orange font-medium"
                        >
                          View Profile
                        </Link>

                        <a
                          onClick={() => startConversation(i)}
                          className="text-orange hover:text-black transition cursor-pointer"
                        >
                          Message
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {myFriends.length == 0 && (
        <div className="bg-white border border-gray rounded-xl p-6 text-center shadow-sm my-4">
          <div className="text-4xl mb-2">🇮🇳 👋</div>
          <h2 className="text-xl font-bold text-black mb-1">
            Find Your First Friend from India!
          </h2>
          <p className="text-sm text-darkGray mb-4 max-w-md mx-auto">
            You haven't connected with friends yet. Connect with fellow Indian students from Telangana, Andhra Pradesh, Maharashtra, Karnataka, Kerala, Gujarat, Tamil Nadu, and more studying in Germany.
          </p>
          <Link
            href="/friends/all/-/-"
            className="inline-block bg-orange hover:bg-opacity-90 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition text-sm"
          >
            🇮🇳 Explore Indian Students Now
          </Link>
        </div>
      )}
      {myFriends.length != 0 && (
        <div className="text-center mt-6 mb-2">
          <Link
            href="/friends/all/-/-"
            className="inline-block bg-orange bg-opacity-10 text-orange border border-orange border-opacity-30 hover:bg-orange hover:text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
          >
            + Connect with More Indian Students 🇮🇳
          </Link>
        </div>
      )}
    </>
  );
};

export default MyFriends;
