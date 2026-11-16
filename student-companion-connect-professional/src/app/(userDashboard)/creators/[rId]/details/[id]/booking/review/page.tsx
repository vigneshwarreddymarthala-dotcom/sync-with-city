"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { REvent } from "@/models/event.model";
import Notify, { showToast } from "@/components/notify";
import { useForm } from "react-hook-form";
import { Review } from "@/models/review.model";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostTab from "@/components/postTab";

export default function ReviewPg({
  params,
}: {
  params: { rId: string; id: string };
}) {
  const [authToken, setAuthToken] = useState<any>("");
  const [userNm, setUserNm] = useState<any>("");
  const [eventInfo, setEventInfo] = useState<REvent>();

  const router = useRouter();

  const { register, handleSubmit, setValue } = useForm<Review>({
    defaultValues: {
      rId: params.rId,
      eventId: params.id,
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
      setUserNm(localStorage.getItem("LogInSCCFNm"));
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
        if (res.status == 200) setEventInfo(rInfo);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getEvent();
  }, [authToken, params.id]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const updateReview = () => {
    if (eventInfo) {
      setValue("userName", userNm);
    }

    handleSubmit(submitReview)();
  };

  const submitReview = async (data: Review) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}review`;
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
      const rInfo: any = await res.json();
      if (res.status == 202) {
        showToast(rInfo, "success");
        router.push("/my-booking");
      } else {
        showToast(rInfo, "error");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };

  return (
    <>
      <Notify />
      <>
        {eventInfo && <PostTab event={eventInfo} link="#" />}
        <form className="my-5">
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Your Review
            </h4>
            <textarea
              {...register("review")}
              className="w-full h-40 bg-white border border-gray text-base rounded outline-none px-3 py-2"
            ></textarea>
          </div>

          <button
            type="button"
            onClick={updateReview}
            className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
          >
            Submit
          </button>
          <div className="mt-3 text-center font-medium text-orange hover:text-black transition">
            <Link href="/my-booking">Skip &gt;&gt;</Link>
          </div>
        </form>
      </>
    </>
  );
}
