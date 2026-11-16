"use client";
import Notify, { showToast } from "@/components/notify";
import Pager from "@/components/pager";
import { BookingFrm } from "@/models/booking.model";
import { isBefore } from "date-fns";
import { safeFormat } from "@/utils/date";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Booking() {
  const [authToken, setAuthToken] = useState<any>("");
  const [eventList, setEventList] = useState<BookingFrm[]>([]);
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
    const getBkEvent = async () => {
      let offset: any = query.get("p") ? query.get("p") : 1;
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/${
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
          setEventList(rInfo.data);
          setTotalItem(rInfo.total);
        } else {
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getBkEvent();
  }, [authToken, query]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const rmvBooking = async (id: string) => {
    if (confirm("Are You Sure Want to Delete?")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/admin/${id}`;
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
          const newList = eventList.filter((item) => item._id !== id);
          setEventList(newList);
          showToast(rInfo, "success");
        } else showToast(rInfo, "error");
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  return (
    <>
      <Notify />
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Booking List
        </h2>
        {eventList.length != 0 && (
          <>
            <div className="flex justify-center mt-3">
              <Pager total={totalItem} size={PAGE_SIZE} offset={pgOffset} />
            </div>
            <ul className="m-0 p-0 list-none">
              {eventList.map((bk: BookingFrm, i: number) => {
                return (
                  <li
                    key={i}
                    className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-lDGray transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
                  >
                    {bk.eventImg && (
                      <Image
                        src={getImgPath(bk.eventImg)}
                        alt=""
                        width={100}
                        height={100}
                        className="size-24 object-cover object-center rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-xl">{bk.eventName}</h3>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Name:</strong>{" "}
                        <span className="font-semibold">{bk.yrName}</span>
                        {bk.yrName1 && (
                          <>
                            <br />
                            <span className="font-semibold">{bk.yrName1}</span>
                          </>
                        )}
                        {bk.yrName2 && (
                          <>
                            <br />
                            <span className="font-semibold">{bk.yrName2}</span>
                          </>
                        )}
                        {bk.yrName3 && (
                          <>
                            <br />
                            <span className="font-semibold">{bk.yrName3}</span>
                          </>
                        )}
                        {bk.yrName3 && (
                          <>
                            <br />
                            <span className="font-semibold">{bk.yrName4}</span>
                          </>
                        )}
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">E-mail:</strong>{" "}
                        <span className="font-semibold">{bk.email}</span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Contact No.:</strong>{" "}
                        <span className="font-semibold">{bk.phNo}</span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Booking On:</strong>{" "}
                        <span className="font-semibold">
                          {safeFormat(bk.createdAt, "dd-MM-yyyy hh:mm a")}
                        </span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Payment Mode:</strong>{" "}
                        <span className="font-semibold">{bk.paymentOpt}</span> |{" "}
                        <strong className="text-darkGray">Status:</strong>{" "}
                        <span className="font-semibold text-green">
                          {bk.payStatus}
                        </span>
                      </p>
                      <p className="text-sm text-black">
                        <strong className="text-darkGray">Status:</strong>{" "}
                        <span className="font-semibold text-green">
                          {!expireEvent(bk.eventDate, bk.eventTime) &&
                            bk.status}
                          {expireEvent(bk.eventDate, bk.eventTime) &&
                            "It's Over!"}
                        </span>
                      </p>
                      <a
                        onClick={() => rmvBooking(bk._id)}
                        className="text-orange cursor-pointer hover:text-black transition font-medium"
                      >
                        Delete Booking
                      </a>
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
        {!eventList ||
          (eventList.length == 0 && (
            <h2 className="text-center font-medium mt-4">No-One Booked Yet!</h2>
          ))}
      </>
    </>
  );
}
