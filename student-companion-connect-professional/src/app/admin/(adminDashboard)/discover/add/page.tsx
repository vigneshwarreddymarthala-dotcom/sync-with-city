"use client";

import Notify, { showToast } from "@/components/notify";
import { Discover } from "@/models/discover.model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";
import Image from "next/image";

export default function AddDiscover() {
  const [authToken, setAuthToken] = useState<any>("");
  const [imgPath, setImgPath] = useState<string[]>([]);
  const router = useRouter();
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];
  const { register, setValue, watch, handleSubmit, reset } =
    useForm<Discover>();

  useEffect(() => {
    if (localStorage.getItem("LogInASCCTkn")) {
      setAuthToken(localStorage.getItem("LogInASCCTkn"));
    }
  }, []);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_Discover_PATH}uploads/${img}`;
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
        "discoverImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_Discover_PATH}discover/upload`;
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
        const img = imgPath;
        setImgPath([...img, data]);
        setValue("imgPath", [...img, data]);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const rmvImg = async (i: number) => {
    const img = imgPath;
    const endpoint = `${process.env.NEXT_PUBLIC_API_Discover_PATH}discover/delete/${img[i]}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    };

    try {
      const res = await fetch(endpoint, options);
      const msg = await res.json();
      if (res.status == 200) {
        const newImg = img.filter((ig) => ig !== img[i]);
        setImgPath(newImg);
        setValue("imgPath", newImg);
      } else showToast("Failed to Delete Image!", "error");
    } catch (e) {
      showToast(e, "error");
    }
  };

  const onSubmit = async (data: Discover) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_Discover_PATH}discover`;
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
        router.push("/admin/discover");
      } else {
        showToast("Failed to Add Discover Data!", "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <section className="container mx-auto">
      <Notify />
      <div
        className={`flex justify-center items-center`}
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <aside className="bg-lightGray w-full border-gray border rounded p-6 md:p-12">
          <h1 className="text-black font-medium text-4xl uppercase text-center">
            Add <span className="text-orange">Discover Board</span>
          </h1>

          <form>
            <div className="my-3 text-center">
              <input
                type="file"
                id="rLogo"
                className="hidden"
                onChange={(e) => addImg(e)}
              />
              <label
                htmlFor="rLogo"
                className="w-full h-64 border border-gray rounded-sm inline-block"
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
                Upload Image
              </h4>
            </div>
            <div>
              {imgPath && imgPath.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {imgPath.map((img: string, i: number) => {
                    return (
                      <li key={i} className="relative">
                        <a
                          onClick={() => rmvImg(i)}
                          className="absolute -right-1 -top-3 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            focusable="false"
                            viewBox="0 0 12 12"
                            className="w-6 h-6 fill-orange"
                          >
                            <path d="M5.5 1C2.46 1 0 3.46 0 6.5S2.46 12 5.5 12 11 9.54 11 6.5 8.54 1 5.5 1zm2.44 7.06c.24.24.24.64 0 .88-.12.12-.28.18-.44.18s-.32-.06-.44-.18L5.5 7.38 3.94 8.94c-.12.12-.28.18-.44.18s-.32-.06-.44-.18a.628.628 0 010-.88L4.62 6.5 3.06 4.94c-.24-.24-.24-.64 0-.88s.64-.24.88 0L5.5 5.62l1.56-1.56c.24-.24.64-.24.88 0s.24.64 0 .88L6.38 6.5l1.56 1.56z" />
                          </svg>
                        </a>
                        <Image
                          src={getImgPath(img)}
                          alt="Discover Image"
                          className="w-36 h-28 object-contain object-center"
                          loading="lazy"
                          width={144}
                          height={100}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Name</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("dName", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Location</h4>
              <select
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("location", { required: true })}
              >
                {locList.location.map((loc: string, i: number) => {
                  return (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="my-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <h4 className="uppercase text-black font-light mb-1">
                    Valid Till Date
                  </h4>
                  <input
                    type="date"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("date", { required: true })}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="uppercase text-black font-light mb-1">
                    Valid Till Time
                  </h4>
                  <input
                    type="time"
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("time", { required: true })}
                  />
                </div>
              </div>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Web Link</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="https://www.google.com/"
                {...register("link")}
              />
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
                href="/admin/discover"
                className="text-black hover:text-orange no-underline"
              >
                &larr; Back to List
              </Link>
            </p>
          </form>
        </aside>
      </div>
    </section>
  );
}
