"use client";

import Notify, { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { UserInfo } from "@/models/user.model";
import { safeFormat } from "@/utils/date";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserList() {
  const [authToken, setAuthToken] = useState<any>("");
  const [userList, setUserList] = useState<UserInfo[]>([]);
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
    const getUsrEvent = async () => {
      let offset: any = query.get("p") ? query.get("p") : 1;
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/${
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
          setUserList(rInfo.data);
          setTotalItem(rInfo.total);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getUsrEvent();
  }, [authToken, query]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const activation = async (id: string, status: boolean) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/${id}`;
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
        setUserList((bk: UserInfo[]) =>
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

  const rmvUser = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/${id}`;
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
          const newList = userList.filter((item) => item._id !== id);
          setUserList(newList);
          showToast(rInfo, "success");
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <Notify />
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          User List
        </h2>
        {userList.length != 0 && (
          <>
            <div className="flex justify-center mt-3">
              <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
            </div>
            <ul className="m-0 p-0 list-none">
              {userList.map((usr: UserInfo, i: number) => {
                return (
                  <li
                    key={i}
                    className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
                  >
                    {usr.usrImg && (
                      <Image
                        src={getImgPath(usr.usrImg)}
                        alt=""
                        width={100}
                        height={100}
                        className="size-24 object-cover object-center rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-xl">{usr.fullName}</h3>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Location:</strong>{" "}
                        <span className="font-semibold">{usr.location}</span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">E-mail:</strong>{" "}
                        <span className="font-semibold">{usr.usrEmail}</span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Join On:</strong>{" "}
                        <span className="font-semibold">
                          {safeFormat(usr.createdAt, "dd-MM-yyyy hh:mm a")}
                        </span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">DOB:</strong>{" "}
                        <span className="font-semibold">{usr.dob}</span>
                      </p>
                      <div className="flex gap-3 my-2">
                        {usr.facebook && (
                          <a href={usr.facebook} target="_blank">
                            <svg
                              width="35"
                              height="35"
                              viewBox="0 0 35 35"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                            >
                              <g clipPath="url(#clip0_31_216)">
                                <path
                                  d="M35 17.5C35 7.83508 27.1649 0 17.5 0C7.83508 0 0 7.83494 0 17.5C0 26.2347 6.39953 33.4746 14.7656 34.7874V22.5586H10.3223V17.5H14.7656V13.6445C14.7656 9.25859 17.3783 6.83594 21.3756 6.83594C23.2903 6.83594 25.293 7.17774 25.293 7.17774V11.4844H23.0863C20.9122 11.4844 20.2344 12.8334 20.2344 14.2174V17.5H25.0879L24.312 22.5586H20.2344V34.7874C28.6005 33.4746 35 26.2348 35 17.5Z"
                                  fill="#1877F2"
                                />
                                <path
                                  d="M24.312 22.5586L25.0879 17.5H20.2344V14.2174C20.2344 12.8332 20.9124 11.4844 23.0863 11.4844H25.293V7.17773C25.293 7.17773 23.2903 6.83594 21.3756 6.83594C17.3783 6.83594 14.7656 9.25859 14.7656 13.6445V17.5H10.3223V22.5586H14.7656V34.7874C15.6702 34.9292 16.5844 35.0002 17.5 35C18.4156 35.0003 19.3298 34.9292 20.2344 34.7874V22.5586H24.312Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_31_216">
                                  <rect width="35" height="35" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        )}
                        {usr.twitter && (
                          <a href={usr.twitter}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 963.66 963.66"
                              className="w-5 h-5"
                            >
                              <circle
                                cx="481.83"
                                cy="481.83"
                                r="481.33"
                                stroke="#fff"
                                strokeMiterlimit="10"
                              />
                              <path
                                d="M185.33,203,415.4,510.58,183.88,760.69H236l202.7-219,163.77,219H779.78l-243-324.92L752.26,203H700.15L513.48,404.63,362.65,203ZM262,241.34h81.46l359.72,481H621.68Z"
                                fill="#fff"
                              />
                            </svg>
                          </a>
                        )}
                        {usr.instagram && (
                          <a href={usr.instagram} target="_blank">
                            <svg
                              width="35"
                              height="35"
                              viewBox="0 0 35 35"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                            >
                              <g clipPath="url(#clip0_31_215)">
                                <path
                                  d="M26.7969 0H8.20312C3.67266 0 0 3.67266 0 8.20312V26.7969C0 31.3273 3.67266 35 8.20312 35H26.7969C31.3273 35 35 31.3273 35 26.7969V8.20312C35 3.67266 31.3273 0 26.7969 0Z"
                                  fill="url(#paint0_radial_31_215)"
                                />
                                <path
                                  d="M26.7969 0H8.20312C3.67266 0 0 3.67266 0 8.20312V26.7969C0 31.3273 3.67266 35 8.20312 35H26.7969C31.3273 35 35 31.3273 35 26.7969V8.20312C35 3.67266 31.3273 0 26.7969 0Z"
                                  fill="url(#paint1_radial_31_215)"
                                />
                                <path
                                  d="M17.5012 3.82812C13.7882 3.82812 13.3221 3.84439 11.8639 3.9107C10.4084 3.97742 9.41486 4.20779 8.54561 4.5459C7.64627 4.89508 6.88352 5.36225 6.12363 6.1224C5.36307 6.88242 4.8959 7.64518 4.54563 8.5441C4.20656 9.41363 3.97592 10.4076 3.91043 11.8624C3.84521 13.3208 3.82812 13.787 3.82812 17.5001C3.82812 21.2133 3.84453 21.6779 3.9107 23.1361C3.9777 24.5916 4.20807 25.5851 4.5459 26.4544C4.89535 27.3537 5.36252 28.1165 6.12268 28.8764C6.88242 29.6369 7.64518 30.1052 8.54383 30.4544C9.41377 30.7925 10.4074 31.0229 11.8627 31.0896C13.3211 31.1559 13.7867 31.1721 17.4996 31.1721C21.213 31.1721 21.6776 31.1559 23.1358 31.0896C24.5913 31.0229 25.586 30.7925 26.4559 30.4544C27.3548 30.1052 28.1165 29.6369 28.8761 28.8764C29.6367 28.1165 30.1037 27.3537 30.4541 26.4548C30.7902 25.5851 31.0209 24.5913 31.0893 23.1364C31.1548 21.6781 31.1719 21.2133 31.1719 17.5001C31.1719 13.787 31.1548 13.3211 31.0893 11.8627C31.0209 10.4072 30.7902 9.41377 30.4541 8.54451C30.1037 7.64518 29.6367 6.88242 28.8761 6.1224C28.1157 5.36197 27.3551 4.8948 26.4551 4.54604C25.5835 4.20779 24.5894 3.97729 23.1339 3.9107C21.6755 3.84439 21.2112 3.82812 17.497 3.82812H17.5012ZM16.2747 6.29193C16.6388 6.29139 17.045 6.29193 17.5012 6.29193C21.1518 6.29193 21.5843 6.30506 23.0259 6.37055C24.3589 6.43152 25.0824 6.65424 25.5644 6.84141C26.2024 7.08914 26.6573 7.38541 27.1355 7.86406C27.614 8.34258 27.9102 8.79826 28.1586 9.43633C28.3458 9.91758 28.5688 10.6411 28.6295 11.9741C28.6949 13.4154 28.7092 13.8482 28.7092 17.497C28.7092 21.1457 28.6949 21.5787 28.6295 23.0199C28.5685 24.3529 28.3458 25.0764 28.1586 25.5578C27.9109 26.1959 27.614 26.6502 27.1355 27.1284C26.657 27.6069 26.2027 27.9031 25.5644 28.1509C25.083 28.3389 24.3589 28.5611 23.0259 28.6221C21.5846 28.6876 21.1518 28.7018 17.5012 28.7018C13.8506 28.7018 13.4179 28.6876 11.9767 28.6221C10.6437 28.5605 9.92018 28.3378 9.43783 28.1507C8.7999 27.9028 8.34408 27.6067 7.86557 27.1281C7.38705 26.6496 7.09092 26.195 6.8425 25.5567C6.65533 25.0753 6.43234 24.3518 6.37164 23.0188C6.30615 21.5775 6.29303 21.1446 6.29303 17.4936C6.29303 13.8426 6.30615 13.412 6.37164 11.9707C6.43262 10.6377 6.65533 9.91416 6.8425 9.43223C7.09037 8.79416 7.38705 8.33848 7.8657 7.85996C8.34422 7.38145 8.7999 7.08518 9.43797 6.83689C9.9199 6.64891 10.6437 6.42674 11.9767 6.36549C13.2379 6.30848 13.7267 6.29139 16.2747 6.28852V6.29193ZM24.7993 8.56201C23.8935 8.56201 23.1587 9.29619 23.1587 10.2021C23.1587 11.1079 23.8935 11.8427 24.7993 11.8427C25.705 11.8427 26.4399 11.1079 26.4399 10.2021C26.4399 9.29633 25.705 8.56146 24.7993 8.56146V8.56201ZM17.5012 10.4789C13.6239 10.4789 10.4802 13.6227 10.4802 17.5001C10.4802 21.3776 13.6239 24.5198 17.5012 24.5198C21.3787 24.5198 24.5213 21.3776 24.5213 17.5001C24.5213 13.6228 21.3784 10.4789 17.501 10.4789H17.5012ZM17.5012 12.9428C20.0181 12.9428 22.0586 14.983 22.0586 17.5001C22.0586 20.017 20.0181 22.0575 17.5012 22.0575C14.9842 22.0575 12.944 20.017 12.944 17.5001C12.944 14.983 14.9842 12.9428 17.5012 12.9428Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <radialGradient
                                  id="paint0_radial_31_215"
                                  cx="0"
                                  cy="0"
                                  r="1"
                                  gradientUnits="userSpaceOnUse"
                                  gradientTransform="translate(9.29687 37.6957) rotate(-90) scale(34.6876 32.2622)"
                                >
                                  <stop stopColor="#FFDD55" />
                                  <stop offset="0.1" stopColor="#FFDD55" />
                                  <stop offset="0.5" stopColor="#FF543E" />
                                  <stop offset="1" stopColor="#C837AB" />
                                </radialGradient>
                                <radialGradient
                                  id="paint1_radial_31_215"
                                  cx="0"
                                  cy="0"
                                  r="1"
                                  gradientUnits="userSpaceOnUse"
                                  gradientTransform="translate(-5.86264 2.52123) rotate(78.681) scale(15.5055 63.9144)"
                                >
                                  <stop stopColor="#3771C8" />
                                  <stop offset="0.128" stopColor="#3771C8" />
                                  <stop
                                    offset="1"
                                    stopColor="#6600FF"
                                    stopOpacity="0"
                                  />
                                </radialGradient>
                                <clipPath id="clip0_31_215">
                                  <rect width="35" height="35" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        )}
                      </div>
                      <a
                        onClick={() => rmvUser(usr._id)}
                        className="text-orange cursor-pointer hover:text-black transition font-medium mr-4"
                      >
                        Remove
                      </a>
                      {usr.status && (
                        <>
                          <a
                            onClick={() => activation(usr._id, false)}
                            className="text-orange cursor-pointer hover:text-black transition"
                          >
                            Block
                          </a>
                        </>
                      )}
                      {!usr.status && (
                        <a
                          onClick={() => activation(usr._id, true)}
                          className="text-orange cursor-pointer hover:text-black transition"
                        >
                          Activate
                        </a>
                      )}
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
        {!userList ||
          (userList.length == 0 && (
            <h2 className="text-center font-medium mt-4">No User Join Yet!</h2>
          ))}
      </>
    </>
  );
}
