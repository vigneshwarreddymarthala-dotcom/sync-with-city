"use client";

import Image from "next/image";
import dndLogo from "../../public/images/Student-Companion-Connect.svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";
import Notify, { showToast } from "./notify";

export default function DisHeader() {
  const [location, setLocation] = useState<any>("");
  const [locPop, setLocPop] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem("locationDis")) {
      const loc = localStorage.getItem("locationDis");

      if (loc != undefined || loc != "") {
        setLocation(loc);
        setLocPop(false);
      } else setLocPop(true);
    } else {
      setLocPop(true);
    }
  }, []);

  const chLocation = async () => {
    try {
      localStorage.setItem("locationDis", location);
      setLocPop(false);
      window.location.reload();
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
      <header className="bg-white py-4 border-gray border-b border-solid sticky top-0 z-40">
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
              <Image src={dndLogo} alt="DnD Restaurants" width={200} />
            </Link>
            {location && !locPop && (
              <h4 className="mb-0 text-sm ml-3 text-black">
                {location}{" "}
                <a
                  onClick={() => setLocPop(true)}
                  className="text-xs text-orange font-medium cursor-pointer"
                >
                  Change
                </a>
              </h4>
            )}
          </div>
        </div>
      </header>
      {locPop && (
        <section className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-gray bg-opacity-40">
          <aside className="bg-white p-6 rounded w-full max-w-96">
            <h2 className="uppercase text-black font-light mb-1">
              You Location
            </h2>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" disabled>
                Select Your Location
              </option>
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
