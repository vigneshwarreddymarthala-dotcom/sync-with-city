"use client";

import { showToast } from "@/components/notify";
import { Review } from "@/models/review.model";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewList({ params }: { params: { id: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const [reviewList, setReviewList] = useState<Review[]>([]);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRvEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}review/${params.id}/0/10`;
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

        if (res.status == 200) setReviewList(rInfo.data);
        else {
          showToast(rInfo, "success");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRvEvent();
  }, [authToken, params]);

  return (
    <>
      <>
        <h2 className="text-2xl font-medium text-orange text-center border-b-2 pb-2 border-orange">
          Reviews
        </h2>
        <ul className="m-0 p-0 list-none">
          {reviewList.map((rv: Review, i: number) => {
            return (
              <li
                className="bg-gray bg-opacity-35 shadow-md text-black hover:bg-orange hover:text-white transition px-4 md:px-8 py-5 rounded-md flex items-center gap-6 my-3 cursor-pointer"
                key={i}
              >
                <div className="flex-initial w-2/3">
                  <h3 className="font-semibold text-2xl">{rv.userName}</h3>
                  <h4 className="text-sm font-medium text-black">
                    <strong className="font-semibold">Reviewed on:</strong>{" "}
                    {rv.createdAt}
                  </h4>
                  <p>{rv.review}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {reviewList.length == 0 && (
          <h2 className="text-center font-medium mt-4">No One Review Yet!</h2>
        )}
        <div className="my-5">
          <Link
            href="/events"
            className="bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition"
          >
            &larr; Back to Posts
          </Link>
        </div>
      </>
    </>
  );
}
