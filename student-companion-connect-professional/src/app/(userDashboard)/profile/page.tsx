"use client";

import Notify, { showToast } from "@/components/notify";
import { UserInfo } from "@/models/user.model";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

export default function UserProfile() {
  const [authToken, setAuthToken] = useState<any>("");
  const [isUsr, setIsUsr] = useState(false);
  const { register, reset, handleSubmit, watch, setValue } = useForm<UserInfo>({
    defaultValues: {
      gender: "Male",
      discoverable: true,
      womenOnly: false,
    },
  });
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getUsr = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const pInfo: any = await res.json();

        if (res.status == 200) {
          reset(pInfo);
          setIsUsr(true);
        } else {
          showToast(pInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getUsr();
  }, [authToken, reset]);

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
        "userImg",
        e.target.files[0],
        fName + "-" + Date.now().toString() + "." + fileName[1]
      );
      uFrm.append("fileType", fileName[1]);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/upload`;
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
        setValue("usrImg", data);
        showToast("Image Uploaded Successfully!", "success");
      } else showToast("Failed to Upload Image!", "error");
    } catch (error) {
      showToast(error, "error");
    }
  };

  const updateProf = async (data: UserInfo) => {
    if (watch("usrImg")) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify(data),
      };

      try {
        const res: any = await fetch(endpoint, options);
        const pInfo: any = await res.json();

        if (res.status == 202) showToast(pInfo, "success");
        else {
          showToast(pInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    } else {
      showToast("Please Upload Image!", "error");
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
          <h1 className="text-orange font-medium text-4xl uppercase text-center">
            Profile
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
                className="w-20 h-20 border border-gray rounded-full inline-block bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage: `url(${getImgPath(watch("usrImg"))})`,
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
                Upload Image
              </h4>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Full Name
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("fullName", { required: true })}
              />
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
              <input
                type="email"
                readOnly
                className="w-full bg-gray border border-gray text-base rounded outline-none px-3 py-2"
                {...register("usrEmail", { required: true })}
              />
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Date of Birth
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("dob", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Gender</h4>
              <select
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("gender")}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Company</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("company")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Profession
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("profession")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Hobbies</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("hobbies")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Short Description
              </h4>
              <textarea
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("description")}
              ></textarea>
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
            {!isUsr && (
              <>
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Native Indian Location
                  </h4>
                  <select
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("locationIndia")}
                  >
                    <option>Select Indian Location</option>
                    {locList.india.map((loc: any, i: number) => {
                      return (
                        <option value={loc.name} key={i}>
                          {loc.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Language
                  </h4>
                  <select
                    className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("language")}
                  >
                    <option value="-">Select Your Mother Tongue</option>
                    {locList.language.map((lng: any, i: number) => {
                      return (
                        <option value={lng.name} key={i}>
                          {lng.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            )}
            {isUsr && (
              <>
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Native Indian Location
                  </h4>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("locationIndia", { required: true })}
                  />
                </div>
                <div className="my-3">
                  <h4 className="uppercase text-black font-light mb-1">
                    Language
                  </h4>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray border border-gray text-base rounded outline-none px-3 py-2"
                    {...register("language", { required: true })}
                  />
                </div>
              </>
            )}
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Facebook</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("facebook")}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                X (Formally Twitter)
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
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
                {...register("instagram")}
              />
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Contact Number
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("contactNo")}
              />
            </div>

            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Contact E-mail
              </h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("contactEmail")}
              />
            </div>
            <div className="my-3">
              <label className="uppercase text-black font-light flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("discoverable")}
                  className="mr-2"
                />
                Is Your Profile Search By Others?
              </label>
            </div>
            {watch("gender") == "Female" && (
              <div className="my-3">
                <label className="uppercase text-black font-light flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("womenOnly")}
                    className="mr-2"
                  />
                  Only Visible to Women
                </label>
              </div>
            )}
            <button
              onClick={handleSubmit(updateProf)}
              type="submit"
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Update
            </button>
            {isUsr && (
              <>
                <Link
                  href={`/creators/${watch("_id")}/events`}
                  className="w-full block text-center mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                >
                  View Profile
                </Link>
                <Link
                  href={`/friends`}
                  className="w-full block text-center mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                >
                  My Friends
                </Link>
              </>
            )}
          </form>
        </aside>
      </div>
    </section>
  );
}
