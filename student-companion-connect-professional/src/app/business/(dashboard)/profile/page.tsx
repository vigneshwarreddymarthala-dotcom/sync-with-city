"use client";

import Notify, { showToast } from "@/components/notify";
import { Creator, CreatorLogin } from "@/models/creator.model";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

export default function Profile() {
  const [formLock, setFormLock] = useState(false);
  const [authToken, setAuthToken] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [menuList, setMenuList] = useState<string[]>([]);
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];
  const { register, setValue, watch, handleSubmit, reset } = useForm<Creator>({
    defaultValues: {
      usrType: "creator",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
      // const owner = localStorage.getItem("LogInRSCCFNm");
      // setValue("ownerName", owner);
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
        reset(rInfo);
        setRData(rInfo);
        setMenuList(rInfo.menuList);
      }

      const cEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner`;
      const cOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const cRes: any = await fetch(cEndpoint, cOptions);
      const cInfo: CreatorLogin = await cRes.json();

      setValue("usrType", cInfo.accType);
    };

    if (authToken) getRData();
  }, [authToken, reset]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

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
      reset(rInfo);
      setRData(rInfo);
      setMenuList(rInfo.menuList);
    }
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
        "creatorImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/upload`;
      const options = {
        method: "POST",
        headers: {
          authorization: authToken,
        },
        body: uFrm,
      };

      showToast("Logo Uploading...", "info");

      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (res.status == 200) {
        setValue("rLogo", data);
        showToast("Logo Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Logo!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const addMenuImg = async (e: any) => {
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
        "creatorImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/upload`;
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
        setMenuList([...menuList, data]);
        setValue("menuList", [...menuList, data]);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const delMenuList = async (index: number) => {
    try {
      let img = watch("menuList");
      const fileName = img[index].split("/");
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/delete/${
        fileName[fileName.length - 1]
      }`;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };
      showToast("Image Start Deleting...", "info");
      const res = await fetch(endpoint, options);
      const msg = await res.json();
      console.log(msg);

      if (res.status == 200) {
        img.splice(index, 1);
        setValue("menuList", img);
        setMenuList(img);
        showToast("Image Deleted Successfully!", "success");
      } else showToast("Failed to Delete Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onSubmit = async (data: Creator) => {
    try {
      if (!formLock) {
        const endpoint = rData
          ? `${process.env.NEXT_PUBLIC_API_PATH}creator/edit/${rData._id}`
          : `${process.env.NEXT_PUBLIC_API_PATH}creator`;
        const options = {
          method: rData ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify(data),
        };

        setFormLock(true);

        const res = await fetch(endpoint, options);
        const msg = await res.json();

        if (res.status == 202) {
          showToast(msg, "success");
          getRData();
        } else {
          showToast("Failed to Update Creator Data!", "error");
        }
        setFormLock(false);
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
          <h1 className="text-black font-medium text-4xl uppercase text-center">
            Creator <span className="text-orange">Profile</span>
          </h1>

          <form>
            <div className="my-3 text-center">
              <input
                type="file"
                id="rLogo"
                className="hidden"
                onChange={(e) => addImg(e)}
                accept="image/*"
              />
              <label
                htmlFor="rLogo"
                className="w-20 h-20 border border-gray rounded-full inline-block bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${getImgPath(watch("rLogo"))})`,
                }}
              >
                <span className="bg-gray bg-opacity-10 rounded-full hover:bg-opacity-50 w-full h-full flex justify-center items-center transition cursor-pointer">
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
                Upload Logo
              </h4>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Creator Name
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("rName", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Description
              </h4>
              <textarea
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("description")}
              ></textarea>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Location</h4>
              {watch("location") && (
                <input
                  type="text"
                  readOnly
                  className="w-full bg-gray border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("location", { required: true })}
                />
              )}
              {!watch("location") && (
                <select
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("location", { required: true })}
                >
                  <option value="">Select Location</option>
                  {locList.location.map((loc: string, i: number) => {
                    return (
                      <option key={i} value={loc}>
                        {loc}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Store Category
              </h4>
              <select
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("category", { required: true })}
              >
                <option value="">Select Your Store Category</option>
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
              <h4 className="uppercase text-black font-light mb-1">
                Manager/Owner Name
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Mr. Lucifer"
                {...register("ownerName", { required: true })}
              />
            </div>
            {/* <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Opening Hours
              </h4>
              <textarea
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="9AM - 10PM (Monday Closed)"
                {...register("openingHr", { required: true })}
              ></textarea>
            </div> */}
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Facebook</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Facebook URL"
                {...register("facebook")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Twitter</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Twitter URL"
                {...register("twitter")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Instagram
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Instagram URL"
                {...register("instagram")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Website</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Website URL"
                {...register("website")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Google Business
              </h4>
              <input
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                placeholder="Google Business Review URL"
                {...register("googleReview")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Images</h4>
              <ul className="flex flex-wrap gap-2">
                <li className="w-48">
                  <input
                    type="file"
                    id="fdMenu"
                    className="hidden"
                    onChange={(e) => addMenuImg(e)}
                    accept="image/*"
                  />
                  <label htmlFor="fdMenu">
                    <span className="bg-gray bg-opacity-10 rounded-sm hover:bg-opacity-50 w-full h-48 flex justify-center items-center transition cursor-pointer">
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
                </li>
                {menuList.map((img: string, i: number) => {
                  return (
                    <li className="w-48 relative" key={i}>
                      <a
                        onClick={() => delMenuList(i)}
                        className="absolute -right-2 -top-2 bg-white rounded-full cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          focusable="false"
                          viewBox="0 0 12 12"
                          className="w-5 h-5"
                        >
                          <path
                            fill="#D00000"
                            d="M5.5 1C2.46 1 0 3.46 0 6.5S2.46 12 5.5 12 11 9.54 11 6.5 8.54 1 5.5 1zm2.44 7.06c.24.24.24.64 0 .88-.12.12-.28.18-.44.18s-.32-.06-.44-.18L5.5 7.38 3.94 8.94c-.12.12-.28.18-.44.18s-.32-.06-.44-.18a.628.628 0 010-.88L4.62 6.5 3.06 4.94c-.24-.24-.24-.64 0-.88s.64-.24.88 0L5.5 5.62l1.56-1.56c.24-.24.64-.24.88 0s.24.64 0 .88L6.38 6.5l1.56 1.56z"
                          />
                        </svg>
                      </a>
                      <Image
                        src={getImgPath(img)}
                        alt="Food Menu"
                        width={300}
                        height={256}
                        className="w-full h-48 object-cover rounded-sm"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Update
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
