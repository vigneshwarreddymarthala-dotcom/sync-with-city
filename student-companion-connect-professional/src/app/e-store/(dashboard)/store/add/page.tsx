"use client";

import Notify, { showToast } from "@/components/notify";
import { Creator } from "@/models/creator.model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";
import { Product } from "@/models/store.model";

export default function AddStore() {
  const [authToken, setAuthToken] = useState<any>("");
  const router = useRouter();
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];

  const { register, setValue, watch, handleSubmit, reset } = useForm<Product>({
    defaultValues: {
      status: true,
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInSSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSSCCTkn"));
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
        setValue("location", rInfo.location);
      }
    };

    if (authToken) getRData();
  }, [authToken]);

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
        "storeImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/upload`;
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
        setValue("images", data);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onSubmit = async (data: Product) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store`;
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
        router.push("/e-store/store");
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
            Create New <span className="text-orange">Product</span>
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
                  backgroundImage: `url(${getImgPath(watch("images"))})`,
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
                Upload Product Image
              </h4>
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Product Name
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("proName", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Category</h4>
              <select
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("category", { required: true })}
              >
                {locList.proCategory.map((proCate: string, i: number) => {
                  return (
                    <option value={proCate} key={i}>
                      {proCate}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Location</h4>
              <input
                type="text"
                readOnly
                className="w-full bg-gray border border-gray text-base rounded outline-none px-3 py-2"
                {...register("location", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Description
              </h4>
              <textarea
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("details", { required: true })}
              ></textarea>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Validation Till
              </h4>
              <div className="flex gap-3">
                <div className="flex-1">
                  {/* <h4 className="uppercase text-black font-light mb-1">Date</h4> */}
                  <input
                    type="date"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("date", { required: true })}
                  />
                </div>
                <div className="flex-1">
                  {/* <h4 className="uppercase text-black font-light mb-1">Time</h4> */}
                  <input
                    type="time"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("time", { required: true })}
                  />
                </div>
              </div>
            </div>

            <div className="my-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <h4 className="uppercase text-black font-light mb-1">
                    Quantity
                  </h4>
                  <input
                    type="tel"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    placeholder="20"
                    min="0"
                    {...register("qty", { required: true })}
                  />
                </div>
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
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Add
            </button>
            <p className="text-center mt-3 text-sm">
              <Link
                href="/e-store/store"
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
