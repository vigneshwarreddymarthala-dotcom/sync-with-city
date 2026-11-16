import { UserInfo } from "@/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToast } from "./notify";
import { friendship } from "@/models/friendship.model";

const FriendTab = ({ usr, myInfo }: { usr: UserInfo; myInfo: UserInfo }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [myRequest, setMyRequest] = useState<friendship[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

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
    <li className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer">
      {usr.usrImg && (
        <Image
          src={getImgPath(usr.usrImg)}
          alt={usr.fullName}
          width={100}
          height={100}
          className="size-24 object-cover object-center rounded-md"
        />
      )}
      <div>
        <h3 className="font-semibold text-2xl">{usr.fullName}</h3>
        <h4 className="text-sm font-medium text-black">
          {usr.locationIndia} - {usr.language}
          <br />
          {usr.company} - {usr.location}
        </h4>

        <div className="flex gap-3 mt-2">
          <Link
            href={`/friends/user/${usr._id}`}
            className="text-orange font-medium"
          >
            View Profile
          </Link>
          {!frdStatus(usr._id) && (
            <a
              onClick={() => frdRequest(usr)}
              className="text-orange font-medium"
            >
              Friend Request
            </a>
          )}
          {frdStatus(usr._id) && (
            <a className="text-darkGray font-medium">{frdStatus(usr._id)}</a>
          )}
        </div>
      </div>
    </li>
  );
};
export default FriendTab;
