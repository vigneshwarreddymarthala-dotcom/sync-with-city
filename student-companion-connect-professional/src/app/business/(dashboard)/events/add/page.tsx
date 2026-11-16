"use client";

import Notify, { showToast } from "@/components/notify";
import { REvent } from "@/models/event.model";
import { Creator } from "@/models/creator.model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

export default function AddEvent() {
  const [authToken, setAuthToken] = useState<any>("");
  const [location, setLocation] = useState<string[]>([]);
  const router = useRouter();
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];

  const { register, setValue, watch, handleSubmit, reset } = useForm<REvent>({
    defaultValues: {
      bookedSeats: "0",
      type: "offer",
      womenOnly: false,
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: Creator = await res.json();

      if (res.status == 200) {
        setValue("rName", rInfo.rName);
        if (rInfo.usrType == "Club") setValue("type", "post");
      }
    };

    if (authToken) getRData();
  }, [authToken, setValue]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const addImg = async (e: any) => {
    const fileName = e.target.files[0].name.split(".");

    if (!upTypes.find((x) => x === fileName[1])) {
      showToast("File Must Be jpg/jpeg/png/gif/webp!", "error");
      return false;
    }

    if (e.target.files[0].size >= 4148576) {
      showToast("Image Must Be Under 4 MB!", "error");
      return false;
    }

    try {
      const uFrm = new FormData();

      const fName = fileName[0]
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      uFrm.append(
        "postImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post/upload`;
      const options = {
        method: "POST",
        headers: {
          authorization: authToken,
        },
        body: uFrm,
      };

      showToast("Image Uploading...", "info");

      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (res.status == 200) {
        setValue("eventImg", data);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const hasLoc = (loc: string) => {
    return location.some((item) => item === loc);
  };

  const addLocation = (loc: string) => {
    if (hasLoc(loc)) {
      const filteredLoc = location.filter((item) => item !== loc);
      setLocation(filteredLoc);
    } else {
      setLocation([...location, loc]);
    }
  };

  const preSubmit = () => {
    const loc = location.join(", ");
    setValue("location", loc);
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: REvent) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}post`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(endpoint, options);
      const msg = await res.json();

      if (res.status == 202) {
        showToast(msg, "success");
        router.push("/business/events");
      } else {
        showToast("Failed to Update Post Data!", "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <>
      <Notify />
      <div
        className={`flex justify-center items-center`}
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <aside className="bg-lightGray w-full border-gray border rounded p-6 md:p-12">
          <h1 className="text-black font-medium text-3xl uppercase text-center">
            Create New{" "}
            {watch("type") == "offer" && (
              <span className="text-orange">Offer</span>
            )}
            {watch("type") == "post" && (
              <span className="text-orange">Post</span>
            )}
            {watch("type") == "announcement" && (
              <span className="text-orange">Announcement</span>
            )}
          </h1>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-3 text-center">
              <input
                type="file"
                id="rLogo"
                className="hidden"
                onChange={(e) => addImg(e)}
              />
              <label
                htmlFor="rLogo"
                className="w-full h-64 border border-gray rounded-sm inline-block bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${getImgPath(watch("eventImg"))})`,
                }}
              >
                <span className="bg-gray bg-opacity-10 rounded-sm hover:bg-opacity-50 w-full h-full flex justify-center items-center transition cursor-pointer">
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-orange w-10 h-10"
                  >
                    <g>
                      <g id="Workspace">
                        <rect
                          fill="none"
                          stroke="none"
                          height="24"
                          width="24"
                        />
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17,10a3.1,3.1,0,0,0-.54.05,4.48,4.48,0,0,0-8.92,0A3.1,3.1,0,0,0,7,10a3,3,0,0,0,0,6H17a3,3,0,0,0,0-6Z"
                        />
                        <polyline
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="10.5 11.5 12 10 13.5 11.5"
                        />
                        <line
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          x1="12"
                          x2="12"
                          y1="10"
                          y2="14"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
              </label>
              <h4 className="uppercase text-black font-light mt-1">
                Upload {watch("type") == "post" && <>Post</>}
                {watch("type") == "offer" && <>Offer</>}
                {watch("type") == "announcement" && <>Announcement</>} Image
              </h4>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                What You Want to Create:
              </h4>
              <select
                {...register("type", { required: true })}
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              >
                <option value="post">Post</option>
                <option value="offer">Offer</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                {watch("type") == "post" && <>Post</>}
                {watch("type") == "offer" && <>Offer</>}
                {watch("type") == "announcement" && <>Announcement</>} Name
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("eventName", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Description
              </h4>
              <textarea
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("description", { required: true })}
              ></textarea>
            </div>
            <div className="my-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <h4 className="uppercase text-black font-light mb-1">Date</h4>
                  <input
                    type="date"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("date", { required: true })}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="uppercase text-black font-light mb-1">Time</h4>
                  <input
                    type="time"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("time", { required: true })}
                  />
                </div>
              </div>
            </div>
            {watch("type") != "announcement" && (
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  Duration
                </h4>
                <input
                  type="text"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  placeholder="20hrs"
                  {...register("duration", { required: true })}
                />
              </div>
            )}
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Location</h4>
              {locList.location.map((loc: string, i: number) => {
                return (
                  <label
                    key={i}
                    className="block my-1 ml-2 text-black cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-1"
                      value={loc}
                      checked={hasLoc(loc) ? true : false}
                      onChange={(e) => addLocation(e.target.value)}
                    />
                    {loc}
                  </label>
                );
              })}
            </div>
            {watch("type") != "announcement" && (
              <div className="my-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <h4 className="uppercase text-black font-light mb-1">
                      Price
                    </h4>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                      placeholder="$20"
                      {...register("price", { required: true })}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="uppercase text-black font-light mb-1">
                      Number Of Seats
                    </h4>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                      placeholder="20"
                      {...register("seats", { required: true })}
                    />
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              onClick={preSubmit}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Add
            </button>
            <p className="text-center mt-3 text-sm">
              <Link
                href="/business/events"
                className="text-black hover:text-orange no-underline"
              >
                &larr; Back to List
              </Link>
            </p>
          </form>
        </aside>
      </div>
    </>
  );
}
