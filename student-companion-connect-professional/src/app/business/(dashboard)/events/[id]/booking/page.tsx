"use client";

import BzBookingTab from "@/components/bzBookingTab";
import Notify, { showToast } from "@/components/notify";
import { BookingFrm } from "@/models/booking.model";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingList({ params }: { params: { id: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [rOwner, setROwner] = useState<any>("");
  const [eventList, setEventList] = useState<BookingFrm[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
      setROwner(localStorage.getItem("LogInRSCCFNm"));
    }
  }, []);

  useEffect(() => {
    const getBkEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/${params.id}/0/10`;
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

        if (res.status == 200) setEventList(rInfo.data);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getBkEvent();
  }, [authToken, params]);

  const cancelBooking = async (id: string) => {
    if (confirm("Are You Sure Want to Cancel?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/status/${id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      };

      try {
        const res: any = await fetch(endpoint, options);
        const bInfo: any = await res.json();

        if (res.status == 202) {
          showToast("Booking Cancelled!", "success");
          setEventList((bk: BookingFrm[]) =>
            bk.map((item: any) => {
              if (item._id === id) {
                return { ...item, status: "Cancelled" };
              }
              return item;
            })
          );
        } else showToast("Failed to Cancel Booking!", "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
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
          usrId: eventList[i].usrId,
          rName: eventList[i].rName,
          usrName: eventList[i].yrName,
        }),
      };

      const res = await fetch(endpoint, options);
      const cInfo = await res.json();

      if (res.status == 202) {
        router.push(`/business/message/${cInfo}`);
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
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Booking List for{" "}
          {eventList.length != 0 && <>{eventList[0].eventName}</>}
        </h2>
        {eventList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {eventList.map((bk: BookingFrm, i: number) => {
              return (
                // <li
                //   className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3"
                //   key={i}
                // >
                //   <div className="flex-initial w-2/3">
                //     <h3 className="font-semibold text-xl">{bk.yrName}</h3>
                //     <p>
                //       {bk.yrName1}, {bk.yrName2}, {bk.yrName3}, {bk.yrName4}
                //     </p>

                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">E-mail:</strong>{" "}
                //       <span className="font-semibold">{bk.email}</span>
                //     </p>
                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">Contact No.:</strong>{" "}
                //       <span className="font-semibold">{bk.phNo}</span>
                //     </p>
                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">Booking On:</strong>{" "}
                //       <span className="font-semibold">
                //         {format(bk.createdAt, "dd-MM-yyyy hh:mm a")}
                //       </span>
                //     </p>
                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">Seats:</strong>{" "}
                //       <span className="font-semibold">{bk.noSpot}</span>
                //     </p>
                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">Payment Mode</strong>{" "}
                //       <span className="font-semibold">{bk.paymentOpt}</span>
                //       <br />
                //       <strong className="text-darkGray">Status:</strong>{" "}
                //       <span className="font-semibold text-green">
                //         {bk.payStatus}
                //       </span>
                //     </p>
                //   </div>
                //   <div className="flex-initial w-1/3 text-center">
                //     <Link
                //       href={`/business/events/65bf9228b0b97aa7ef1aaf0e/booking/${bk.usrId}`}
                //       className="text-orange hover:text-black transition"
                //     >
                //       User Profile
                //     </Link>
                //     <br />
                //     <a
                //       onClick={() => startConversation(i)}
                //       className="text-orange hover:text-black transition cursor-pointer"
                //     >
                //       Message
                //     </a>
                //     {bk.status != "Cancelled" && (
                //       <>
                //         <br />
                //         <a
                //           onClick={() => cancelBooking(bk._id)}
                //           className="mx-2 md:mx-5 text-red hover:text-black transition cursor-pointer"
                //         >
                //           Cancel
                //         </a>
                //       </>
                //     )}
                //   </div>
                // </li>
                <BzBookingTab
                  type="business"
                  bk={bk}
                  key={i}
                  authToken={authToken}
                  bCancel={(id: string) => cancelBooking(id)}
                />
              );
            })}
          </ul>
        )}
        {eventList.length == 0 && (
          <h2 className="text-center font-medium mt-4">No-One Booked Yet!</h2>
        )}
        <div className="my-5">
          <Link
            href={`/business/events`}
            className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
          >
            &larr; Back to Posts
          </Link>
        </div>
      </>
    </>
  );
}
