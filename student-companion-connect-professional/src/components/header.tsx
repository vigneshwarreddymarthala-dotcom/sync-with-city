"use client";

import Image from "next/image";
import syncLogo from "../../public/images/sync.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "./notify";
import { CreatorLogin } from "@/models/creator.model";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [authToken, setAuthToken] = useState<any>("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("LogInRSCCTkn")) {
      router.push("/business");
    } else {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, [router]);

  useEffect(() => {
    const getOwnerData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const rInfo: CreatorLogin = await res.json();

      if (res.status == 200) {
        setStatus(rInfo.status);
      }
    };

    if (authToken) getOwnerData();
  }, [authToken]);

  const logout = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/session`;
    const logToken: any = localStorage.getItem("LogInRSCCTkn");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: logToken,
      },
    };

    try {
      const res = await fetch(endpoint, options);

      localStorage.removeItem("LogInRSCCTkn");
      localStorage.removeItem("LogInRSCCFNm");
      localStorage.removeItem("LogInRSCCTime");

      router.push("/business");
    } catch (e) {
      showToast(e, "error");
    }
  };

  const backPg = () => {
    router.back();
  };
  return (
    <>
      <header className="bg-white py-4 border-gray border-b border-solid sticky top-0 z-40">
        <Notify />
        <div className="container mx-auto px-5">
          <div className="flex items-center">
            {pathname != "/" && (
              <a
                onClick={backPg}
                className="px-2 rounded-full text-2xl cursor-pointer"
              >
                &lt;
              </a>
            )}
            <Link href="/">
              <Image src={syncLogo} alt="Sync with City" className="w-16" />
            </Link>
            <a
              onClick={logout}
              className="ml-auto cursor-pointer flex items-center"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 15 15"
                enableBackground="new 0 0 15 15"
                className="fill-orange w-4 h-4 mr-2"
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
    </>
  );
}
