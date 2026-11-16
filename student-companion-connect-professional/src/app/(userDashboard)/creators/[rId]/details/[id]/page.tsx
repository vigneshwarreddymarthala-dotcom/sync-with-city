"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import { safeFormat } from "@/utils/date";
import SharePop from "@/components/sharePop";

export default function AllEvent({
  params,
}: {
  params: { rId: string; id: string };
}) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [eventInfo, setEventInfo] = useState<REvent>();
  const [isBooked, setIsBooked] = useState(false);
  const [myInfo, setMyInfo] = useState<string>();
  const [sharePop, setSharePop] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/${params.id}`;
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
          setEventInfo(rInfo);
          const endpointM = `${process.env.NEXT_PUBLIC_API_PATH}user`;
          const optionsM = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authToken,
            },
          };
          const mRes: any = await fetch(endpointM, optionsM);
          const mInfo: any = await mRes.json();

          setMyInfo(mInfo._id);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getEvent();
  }, [authToken, params.id]);

  useEffect(() => {
    const getBooking = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking/event/${eventInfo?._id}`;
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

        if (res.status == 200) setIsBooked(true);
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && eventInfo) getBooking();
  }, [authToken, eventInfo]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const bookNow = () => {
    router.push(`/creators/${params.rId}/details/${params.id}/booking`);
  };

  const reviewNow = () => {
    router.push(`/creators/${params.rId}/details/${params.id}/booking/review`);
  };

  const soldOut = (seats: string, bkSeats: string) => {
    if (parseInt(seats) > parseInt(bkSeats)) return false;
    else return true;
  };

  const expireEvent = (date: string, time: string) => {
    try {
      const today = new Date();
      const parsed = new Date(date + " " + time);
      if (isNaN(parsed.getTime())) return false;
      return isBefore(parsed, today);
    } catch {
      return false;
    }
  };

  return (
    <>
      <Notify />
      <SharePop
        showPop={sharePop}
        data={"h"}
        statusPop={(e) => setSharePop(e)}
      />
      {eventInfo && (
        <>
          <div className="relative">
            <a
              onClick={() => setSharePop(true)}
              className=" cursor-pointer absolute right-1 top-1 bg-orange flex gap-2 items-center p-2 text-white font-medium rounded-lg text-sm shadow-md"
            >
              Share
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 525.152 525.152"
                enableBackground="new 0 0 525.152 525.152"
                className="w-5 h-5 fill-white"
              >
                <g>
                  <path
                    d="M420.735,371.217c-20.021,0-37.942,7.855-51.596,20.24L181.112,282.094c1.357-6.061,2.407-12.166,2.407-18.468
		c0-6.302-1.072-12.385-2.407-18.468l185.904-108.335c14.179,13.129,32.931,21.334,53.719,21.334
		c43.828,0,79.145-35.251,79.145-79.079C499.88,35.338,464.541,0,420.735,0c-43.741,0-79.079,35.338-79.079,79.057
		c0,6.389,1.072,12.385,2.407,18.468L158.158,205.947c-14.201-13.194-32.931-21.378-53.741-21.378
		c-43.828,0-79.145,35.317-79.145,79.057s35.317,79.079,79.145,79.079c20.787,0,39.54-8.206,53.719-21.334l187.698,109.604
		c-1.291,5.58-2.101,11.4-2.101,17.199c0,42.45,34.594,76.979,76.979,76.979c42.428,0,77.044-34.507,77.044-76.979
		S463.163,371.217,420.735,371.217z"
                  />
                </g>
              </svg>
            </a>
            {eventInfo.eventImg && (
              <Image
                src={getImgPath(eventInfo.eventImg)}
                alt={eventInfo.eventName}
                width={300}
                height={250}
                className="w-full h-auto object-cover object-center rounded mb-3"
              />
            )}
          </div>

          <h2 className="font-semibold text-3xl text-orange">
            <strong className="font-medium text-orange text-xs">
              {eventInfo.type == "post" && <>Post</>}
              {eventInfo.type == "offer" && <>Offer</>}
              {eventInfo.type == "announcement" && <>Announcement</>} Name
            </strong>
            <br />
            {eventInfo.eventName}
          </h2>
          <p className="text-black text-base">
            <strong className="font-bold text-black text-xs">
              Description
            </strong>
            <br />
            {eventInfo.description}
          </p>
          <h3 className="my-4 font-medium flex gap-2 text-sm items-center">
            <svg
              enableBackground="new 0 0 64 64"
              version="1.1"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-orange"
            >
              <g id="Glyph">
                <path d="M52.708,20.849C52.708,8.185,44.584,0,32,0S11.292,8.185,11.292,20.849c0,10.556,16.311,31.747,18.175,34.118l2.278,2.928   c-9.542,0.025-17.237,1.38-17.237,3.051c0,1.686,7.836,3.053,17.502,3.053s17.502-1.367,17.502-3.053   c0-1.672-7.704-3.028-17.255-3.051l2.292-2.928C36.396,52.581,52.708,31.39,52.708,20.849z M25.294,20.835   c0-3.604,3.002-6.526,6.706-6.526c3.704,0,6.706,2.922,6.706,6.526S35.704,27.361,32,27.361   C28.296,27.361,25.294,24.439,25.294,20.835z" />
              </g>
            </svg>
            <span>{eventInfo.location}</span>
          </h3>

          <h3 className="my-4 font-medium flex gap-2 text-sm items-center">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="485.213px"
              height="485.212px"
              viewBox="0 0 485.213 485.212"
              enableBackground="new 0 0 485.213 485.212"
              className="w-5 h-5 fill-orange"
            >
              <g>
                <path
                  d="M60.652,75.816V15.163C60.652,6.781,67.433,0,75.817,0c8.38,0,15.161,6.781,15.161,15.163v60.653
		c0,8.38-6.781,15.161-15.161,15.161C67.433,90.978,60.652,84.196,60.652,75.816z M318.424,90.978
		c8.378,0,15.163-6.781,15.163-15.161V15.163C333.587,6.781,326.802,0,318.424,0c-8.382,0-15.168,6.781-15.168,15.163v60.653
		C303.256,84.196,310.042,90.978,318.424,90.978z M485.212,363.906c0,66.996-54.312,121.307-121.303,121.307
		c-66.986,0-121.302-54.311-121.302-121.307c0-66.986,54.315-121.3,121.302-121.3C430.9,242.606,485.212,296.919,485.212,363.906z
		 M454.89,363.906c0-50.161-40.81-90.976-90.98-90.976c-50.166,0-90.976,40.814-90.976,90.976c0,50.171,40.81,90.98,90.976,90.98
		C414.08,454.886,454.89,414.077,454.89,363.906z M121.305,181.955H60.652v60.651h60.653V181.955z M60.652,333.584h60.653V272.93
		H60.652V333.584z M151.629,242.606h60.654v-60.651h-60.654V242.606z M151.629,333.584h60.654V272.93h-60.654V333.584z
		 M30.328,360.891V151.628h333.582v60.653h30.327V94c0-18.421-14.692-33.349-32.843-33.349h-12.647v15.166
		c0,16.701-13.596,30.325-30.322,30.325c-16.731,0-30.326-13.624-30.326-30.325V60.651H106.14v15.166
		c0,16.701-13.593,30.325-30.322,30.325c-16.733,0-30.327-13.624-30.327-30.325V60.651H32.859C14.707,60.651,0.001,75.579,0.001,94
		v266.892c0,18.36,14.706,33.346,32.858,33.346h179.424v-30.331H32.859C31.485,363.906,30.328,362.487,30.328,360.891z
		 M303.256,242.606v-60.651h-60.648v60.651H303.256z M409.399,363.906h-45.49v-45.49c0-8.377-6.781-15.158-15.163-15.158
		s-15.159,6.781-15.159,15.158v60.658c0,8.378,6.777,15.163,15.159,15.163h60.653c8.382,0,15.163-6.785,15.163-15.163
		C424.562,370.692,417.781,363.906,409.399,363.906z"
                />
              </g>
            </svg>
            {safeFormat(eventInfo.date, "EEE, do MMM")} | {eventInfo.time}
          </h3>
          {eventInfo.type != "announcement" && (
            <>
              <h3 className="my-4 font-medium flex gap-2 text-sm items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-orange"
                >
                  <path
                    fillRule="evenodd"
                    d="M13,11.4226497 L13,7 C13,6.448 12.552,6 12,6 C11.448,6 11,6.448 11,7 L11,11.9888376 C10.998236,12.1652918 11.043253,12.339672 11.1300028,12.4931377 C11.2274619,12.6587312 11.3559711,12.7849072 11.509667,12.8716066 L15.830127,15.3660254 C16.308173,15.6420254 16.9201524,15.478046 17.1961524,15 C17.4721524,14.521954 17.308173,13.9099746 16.830127,13.6339746 L13,11.4226497 Z M12,2 C17.5229861,2 22,6.47701386 22,12 C22,17.5229861 17.5229861,22 12,22 C6.47701386,22 2,17.5229861 2,12 C2,6.47701386 6.47701386,2 12,2 Z"
                  />
                </svg>
                {eventInfo.duration}{" "}
                <small className="text-darkGray">(Duration)</small>
              </h3>
              <h3 className="my-4 text-3xl text-orange font-semibold">
                {(!eventInfo.price || eventInfo.price != "0") && (
                  <>
                    {isNaN(Number(eventInfo.price)) ? "" : `€`}
                    {eventInfo.price}
                  </>
                )}
              </h3>
              {expireEvent(eventInfo.date, eventInfo.time) && (
                <h3 className="my-4 text-4xl text-red font-semibold text-center">
                  Expired!
                </h3>
              )}

              {soldOut(eventInfo.seats, eventInfo.bookedSeats) && (
                <h3 className="my-4 text-4xl text-red font-semibold text-center">
                  Sold Out!
                </h3>
              )}

              {myInfo != eventInfo.rId && (
                <>
                  {!isBooked &&
                    !expireEvent(eventInfo.date, eventInfo.time) &&
                    !soldOut(eventInfo.seats, eventInfo.bookedSeats) && (
                      <button
                        onClick={bookNow}
                        className="w-full mt-2 bg-orange py-2 px-3 rounded-md border-none transition font-medium text-base text-white hover:text-black"
                        type="button"
                      >
                        Book Now
                      </button>
                    )}

                  {isBooked && (
                    <button
                      onClick={reviewNow}
                      className="w-full mt-2 bg-orange py-2 px-3 rounded-md border-none transition font-medium text-base text-white hover:text-black"
                      type="button"
                    >
                      Review Now
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
