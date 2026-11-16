"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { BookingFrm } from "@/models/booking.model";
import { Creator } from "@/models/creator.model";
import BzBookingTab from "@/components/bzBookingTab";
import BzPstNavigation from "@/components/bzPstNavigation";

export default function Bookings() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [eventList, setEventList] = useState<BookingFrm[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRest = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator`;
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

        if (res.status == 200) setRData(rInfo);
        else {
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRest();
  }, [authToken]);

  useEffect(() => {
    const getBkEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/owner/${rData?.rId}/0/10`;
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
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && rData) getBkEvent();
  }, [authToken, rData]);

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

  return (
    <>
      <Notify />
      <>
        <BzPstNavigation type="business" />
        {eventList.length != 0 && (
          <ul className="m-0 p-0 list-none">
            {eventList.map((bk: BookingFrm, i: number) => {
              return (
                // <li
                //   key={i}
                //   className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-orange hover:text-white transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
                // >
                //   {bk.eventImg && (
                //     <Image
                //       src={getImgPath(bk.eventImg)}
                //       alt=""
                //       width={100}
                //       height={100}
                //       className="size-24 object-cover object-center rounded-md"
                //     />
                //   )}
                //   <div>
                //     <h3 className="font-semibold text-xl">
                //       {bk.type && (
                //         <>
                //           <span className="text-xs font-medium bg-orange text-white px-2 rounded-md">
                //             {bk.type}
                //           </span>
                //           <br />
                //         </>
                //       )}
                //       {bk.yrName}, {bk.yrName1}, {bk.yrName2}, {bk.yrName3},{" "}
                //       {bk.yrName4}
                //     </h3>
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
                //       <strong className="text-darkGray">Payment Mode</strong>{" "}
                //       <span className="font-semibold">{bk.paymentOpt}</span> |{" "}
                //       <strong className="text-darkGray">Status:</strong>{" "}
                //       <span className="font-semibold text-green">
                //         {bk.payStatus}
                //       </span>
                //     </p>
                //     <p className="text-sm text-black">
                //       <strong className="text-darkGray">Status:</strong>{" "}
                //       <span className="font-semibold text-green">
                //         {!expireEvent(bk.eventDate, bk.eventTime) && bk.status}
                //         {expireEvent(bk.eventDate, bk.eventTime) &&
                //           "It's Over!"}
                //       </span>
                //     </p>
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
        {!eventList ||
          (eventList.length == 0 && (
            <h2 className="text-center font-medium mt-4">No-One Booked Yet!</h2>
          ))}
      </>
    </>
  );
}
