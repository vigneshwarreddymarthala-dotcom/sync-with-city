"use client";

import Image from "next/image";
import syncLogo from "../../public/images/sync.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Notify, { showToast } from "./notify";
import locList from "@/db/location.json";
import { UserInfo } from "@/models/user.model";
import { Tooltip } from "react-tooltip";

export default function UserHeader() {
  const [location, setLocation] = useState<any>("");
  const [locPop, setLocPop] = useState(false);
  const [authToken, setAuthToken] = useState<any>("");
  const [status, setStatus] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem("LogInSCCTkn")) {
      router.push("/");
    } else setAuthToken(localStorage.getItem("LogInSCCTkn"));
  }, []);

  useEffect(() => {
    const getOwnerData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: UserInfo = await res.json();

      if (res.status == 200) {
        setStatus(rInfo.status);
      }
    };

    if (authToken) getOwnerData();
  }, [authToken]);

  useEffect(() => {
    if (localStorage.getItem("location")) {
      const loc = localStorage.getItem("location");

      if (loc != undefined || loc != "") {
        setLocation(loc);
        setLocPop(false);
      } else setLocPop(true);
    } else {
      setLocPop(true);
    }
  }, []);

  const chLocation = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/location`;
    const logToken: any = localStorage.getItem("LogInSCCTkn");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: logToken,
      },
      body: JSON.stringify({ location: location }),
    };
    try {
      const res = await fetch(endpoint, options);
      localStorage.setItem("location", location);
      setLocPop(false);
      window.location.reload();
    } catch (e) {
      showToast(e, "error");
    }
  };

  const logout = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/session`;
    const logToken: any = localStorage.getItem("LogInSCCTkn");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: logToken,
      },
    };

    try {
      const res = await fetch(endpoint, options);

      localStorage.removeItem("LogInSCCTkn");
      localStorage.removeItem("LogInSCCFNm");
      localStorage.removeItem("LogInSCCTime");
      localStorage.removeItem("location");

      router.push("/");
    } catch (e) {
      showToast(e, "error");
    }
  };

  const backPg = () => {
    router.back();
  };
  return (
    <>
      <Notify />
      <header className="bg-orange py-3 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-5">
          <div className="flex items-center">
            {pathname != "/" && (
              <a
                onClick={backPg}
                className="px-2 text-white rounded-full text-2xl cursor-pointer"
              >
                &lt;
              </a>
            )}
            <Link href="/">
              <Image src={syncLogo} alt="Sync with City" className="w-16" />
            </Link>
            {location && !locPop && (
              <h4 className="mb-0 text-base ml-5 text-white font-medium">
                {location}{" "}
                {/* <a
                  onClick={() => setLocPop(true)}
                  className="text-xs text-orange font-medium cursor-pointer"
                  data-tooltip-id="locTips"
                >
                  Change
                </a>
                <Tooltip
                  id="locTips"
                  content="Change Your Location"
                  events={["hover"]}
                /> */}
              </h4>
            )}

            <a
              onClick={logout}
              className="ml-auto cursor-pointer flex font-medium items-center text-white"
              data-tooltip-id="logoutTips"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 15 15"
                enableBackground="new 0 0 15 15"
                className="fill-white w-4 h-4 mr-2"
              >
                <g>
                  <path
                    d="M10.5,1.674V4c1.215,0.912,2,2.364,2,4c0,2.762-2.238,5-5,5s-5-2.238-5-5c0-1.636,0.785-3.088,2-4
		V1.674C2.135,2.797,0.5,5.208,0.5,8c0,3.866,3.134,7,7,7s7-3.134,7-7C14.5,5.208,12.865,2.797,10.5,1.674z"
                  />
                  <path
                    d="M8.5,7.003V0.997C8.5,0.446,8.056,0,7.5,0c-0.553,0-1,0.453-1,0.997v6.006C6.5,7.554,6.944,8,7.5,8
		C8.053,8,8.5,7.547,8.5,7.003z"
                  />
                </g>
              </svg>
              Logout
            </a>
            <Tooltip
              id="logoutTips"
              content="Logout from Your Account"
              events={["hover"]}
            />
          </div>
        </div>
      </header>
      {!status && (
        <section className="bg-black bg-opacity-60 fixed top-0 right-0 left-0 bottom-0 z-30 flex justify-center items-center">
          <h1 className="text-center font-semibold text-3xl text-white leading-loose">
            Your Account Not Yet Approved By Admin!
            <br />
            Wait for Approval...
          </h1>
        </section>
      )}
      {locPop && status && (
        <section className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-gray bg-opacity-40">
          <aside className="bg-white p-6 rounded w-full max-w-96">
            <h2 className="uppercase text-black font-light mb-1">
              You University
            </h2>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Your Location</option>
              {locList.location.map((loc: string, i: number) => {
                return (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
              onClick={chLocation}
            >
              Update
            </button>
          </aside>
        </section>
      )}
    </>
  );
}
