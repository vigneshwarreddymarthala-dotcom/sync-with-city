"use client";

import Notify, { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { friendship } from "@/models/friendship.model";
import { UserInfo } from "@/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FrdSearchPg = ({
  qry,
  state,
  lang,
}: {
  qry: string;
  state: string;
  lang: string;
}) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [usrList, setUsrList] = useState<UserInfo[]>([]);
  const [myInfo, setMyInfo] = useState<UserInfo>();
  const [myRequest, setMyRequest] = useState<friendship[]>([]);
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
    const usrSearch = async (qry: string) => {
      try {
        let offset: any = query.get("p") ? query.get("p") : 1;
        const endpoint = `${
          process.env.NEXT_PUBLIC_API_PATH
        }user/search/${qry}/${state}/${lang}/${offset - 1}/${PAGE_SIZE}`;
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
        setUsrList(rInfo.data);
        setTotalItem(rInfo.total);

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

        const frdEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}friend/request/all`;
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

    if (authToken) usrSearch(qry);
  }, [qry, lang, state, query, authToken]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const frdRequest = async (usr: UserInfo) => {
    try {
      if (myInfo) {
        const frdData = {
          fromUsrId: myInfo._id,
          fromUsrNm: myInfo.fullName,
          fromUsrImg: myInfo.usrImg,
          toUsrId: usr._id,
          toUsrNm: usr.fullName,
          toUsrImg: usr.usrImg,
          status: "Pending",
        };
        const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}friend/request`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify(frdData),
        };

        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();

        if (res.status == 202) {
          showToast(rInfo, "success");
          const fData: friendship = { ...frdData, _id: "" };
          setMyRequest([...myRequest, fData]);
        } else showToast(rInfo, "error");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };

  const frdStatus = (fId: string) => {
    const myFrd: friendship[] = myRequest.filter(
      (item: friendship) => item.fromUsrId === fId || item.toUsrId === fId
    );

    if (myFrd && myFrd.length != 0) {
      if (myFrd[0].status == "Pending") return "Friend Request Sent";
      else return myFrd[0].status;
    } else return false;
  };

  return (
    <>
      <Notify />
      {usrList.length != 0 && (
        <>
          <div className="flex items-center justify-between mb-3 px-1 py-1 bg-white border border-gray rounded-lg px-3">
            <span className="text-xs md:text-sm font-semibold text-black">
              {state && state !== "-" ? (
                <>
                  Students from <strong className="text-orange">🇮🇳 {decodeURIComponent(state)}</strong>
                </>
              ) : (
                <>
                  Students from <strong className="text-orange">🇮🇳 All India</strong>
                </>
              )}
              {lang && lang !== "-" && (
                <>
                  {" "}• Speaking <strong className="text-orange">{decodeURIComponent(lang)}</strong>
                </>
              )}
            </span>
            <span className="text-xs bg-orange bg-opacity-15 text-orange px-2 py-0.5 rounded-full font-bold">
              {totalItem} Student{totalItem === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="m-0 p-0 list-none">
            {usrList.map((bk: UserInfo, i: number) => {
              return (
                <li
                  key={i}
                  className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
                >
                  {bk.usrImg && (
                    <Image
                      src={getImgPath(bk.usrImg)}
                      alt={bk.fullName}
                      width={100}
                      height={100}
                      className="size-24 object-cover object-center rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-xl md:text-2xl text-black">
                        {bk.fullName}
                      </h3>
                      {bk.locationIndia && (
                        <span className="text-xs bg-orange bg-opacity-15 text-orange font-semibold px-2 py-0.5 rounded-full">
                          🇮🇳 {bk.locationIndia}
                        </span>
                      )}
                      {bk.language && (
                        <span className="text-xs bg-gray bg-opacity-50 text-darkGray font-medium px-2 py-0.5 rounded-full">
                          🗣️ {bk.language}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-darkGray">
                      {bk.company && <span className="text-black font-semibold">{bk.company}</span>}
                      {bk.company && bk.location && " • "}
                      <span>{bk.location}</span>
                    </h4>

                    <div className="flex items-center gap-3 mt-3">
                      <Link
                        href={`/friends/user/${bk._id}`}
                        className="text-orange hover:underline font-semibold text-sm"
                      >
                        View Profile
                      </Link>
                      {!frdStatus(bk._id) && (
                        <button
                          type="button"
                          onClick={() => frdRequest(bk)}
                          className="bg-orange hover:bg-opacity-90 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition"
                        >
                          + Friend Request
                        </button>
                      )}
                      {frdStatus(bk._id) && (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray bg-opacity-40 text-darkGray">
                          ✓ {frdStatus(bk._id)}
                        </span>
                      )}
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
      {usrList.length == 0 && (
        <h2 className="text-center font-medium">No User Found!</h2>
      )}
    </>
  );
};

export default FrdSearchPg;
