"use client";

import Notify, { showToast } from "@/components/notify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import locList from "@/db/location.json";
import { BzInfo } from "@/models/info.model";

const smallToolbarOptions = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],

    ["clean"],
  ],
};

export default function EditEvent({ params }: { params: { id: string } }) {
  const [authToken, setAuthToken] = useState<any>("");
  const router = useRouter();
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];
  const { register, setValue, watch, handleSubmit, reset } = useForm<BzInfo>();

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getNewsData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/${params.id}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: BzInfo = await res.json();

      if (res.status == 200) {
        reset(rInfo);
      }
    };

    if (authToken) getNewsData();
  }, [authToken, reset, params.id, setValue]);

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
        "bzInfoImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/upload`;
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
        setValue("iImg", data);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleDetailChange = (html: any) => {
    setValue("description", html);
  };

  const onSubmit = async (data: BzInfo) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/edit/${params.id}`;
    const options = {
      method: "PUT",
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
        router.push("/business/info");
      } else {
        showToast("Failed to Update Post Data!", "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <section className="container mx-auto">
      <Notify />
      <div
        className={`flex justify-center items-center py-12`}
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <aside className="bg-lightGray w-full max-w-xl border-gray border rounded p-6 md:p-12">
          <h1 className="text-black font-medium text-4xl uppercase text-center">
            Update <span className="text-orange">Information</span>
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
                className="w-full h-64 border border-gray rounded-sm inline-block bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${getImgPath(watch("iImg"))})`,
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
                Upload Information Image
              </h4>
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Title</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("iTitle", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Type</h4>
              <select
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("iType", { required: true })}
              >
                {locList.type.map((cate: string, i: number) => {
                  return (
                    <option key={i} value={cate}>
                      {cate}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Description
              </h4>
              <DynamicQuill
                value={watch("description")}
                modules={smallToolbarOptions}
                onChange={handleDetailChange}
                className="bg-white"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Update
            </button>
            <p className="text-center mt-3 text-sm">
              <Link
                href="/business/info"
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
