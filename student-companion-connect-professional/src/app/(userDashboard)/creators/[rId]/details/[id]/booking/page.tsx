"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { REvent } from "@/models/event.model";
import Notify, { showToast } from "@/components/notify";
import { useForm } from "react-hook-form";
import { BookingFrm } from "@/models/booking.model";
import { UserInfo } from "@/models/user.model";
import PostTab from "@/components/postTab";

export default function Booking({
  params,
}: {
  params: { rId: string; id: string };
}) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [eventData, setEventData] = useState<REvent>();
  const [noSpots, setNoSpots] = useState(1);
  const [myInfo, setMyInfo] = useState<string>();
  const { register, handleSubmit, setValue, watch } = useForm<BookingFrm>({
    defaultValues: {
      eventId: params.id,
      noSpot: "1",
      status: "Coming",
      payStatus: "Paid",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      try {
        const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/${params.id}`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const eRes: any = await fetch(eEndpoint, options);
        const eInfo: REvent = await eRes.json();

        if (eRes.status == 200) {
          setEventData(eInfo);
          setValue("eventDate", eInfo.date);
          setValue("eventTime", eInfo.time);
          const spot = parseInt(eInfo.seats) - parseInt(eInfo.bookedSeats);
          setNoSpots(spot > 5 ? 5 : spot);
        }

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
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, params, setValue]);

  const updateBooking = (pay: string) => {
    if (eventData) {
      setValue("price", eventData.price);
      setValue("paymentOpt", pay);
      setValue("eventImg", eventData.eventImg);
      setValue("eventName", eventData.eventName);
      setValue("location", eventData.location);
      setValue("rId", eventData.rId);
      setValue("rName", eventData.rName);
      setValue("type", eventData.type);
    }

    handleSubmit(payNow)();
  };

  const payNow = async (data: BookingFrm) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}booking`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(data),
    };

    try {
      const res: any = await fetch(endpoint, options);
      const bk: any = await res.json();

      if (res.status == 202) {
        showToast(bk, "success");
        router.push(
          `/creators/${params.rId}/details/${params.id}/booking/review`
        );
      } else {
        showToast("Booking Failed!", "error");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };
  return (
    <>
      <Notify />
      <>
        {eventData && (
          <>
            <PostTab event={eventData} link="#" />

            <form action="" className="my-5">
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  Number Of Spots
                </h4>
                <select
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("noSpot", { required: true })}
                >
                  {noSpots >= 1 && <option value="1">1</option>}
                  {noSpots >= 2 && <option value="2">2</option>}
                  {noSpots >= 3 && <option value="3">3</option>}
                  {noSpots >= 4 && <option value="4">4</option>}
                  {noSpots >= 5 && <option value="5">5</option>}
                </select>
              </div>
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">Name</h4>
                <input
                  type="text"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("yrName", { required: true })}
                />
              </div>
              {parseInt(watch("noSpot")) >= 2 && (
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Person 2 Name
                  </h4>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("yrName1", { required: true })}
                  />
                </div>
              )}
              {parseInt(watch("noSpot")) >= 3 && (
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Person 3 Name
                  </h4>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("yrName2", { required: true })}
                  />
                </div>
              )}
              {parseInt(watch("noSpot")) >= 4 && (
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Person 4 Name
                  </h4>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("yrName3", { required: true })}
                  />
                </div>
              )}
              {parseInt(watch("noSpot")) == 5 && (
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Person 5 Name
                  </h4>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("yrName4", { required: true })}
                  />
                </div>
              )}
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  E-mail Address
                </h4>
                <input
                  type="email"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  Contact Number
                </h4>
                <input
                  type="tel"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("phNo", { required: true })}
                />
              </div>
              {/* <h4 className="font-semibold uppercase text-black mb-1">
                Pay With
              </h4> */}
              {myInfo != eventData._id && (
                <>
                  {/* <button
                    type="button"
                    onClick={() => updateBooking("PayPal")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBooking("Apple Pay")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBooking("Card")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    Credit or Debit Card
                  </button> */}
                  <button
                    type="button"
                    onClick={() => updateBooking("Reserved")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    Reserve My Spot
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </>
    </>
  );
}
