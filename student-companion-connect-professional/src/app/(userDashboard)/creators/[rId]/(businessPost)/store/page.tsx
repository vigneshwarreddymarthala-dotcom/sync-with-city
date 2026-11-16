"use client";

import { showToast } from "@/components/notify";
import StoreTab from "@/components/storeTab";
import { Product } from "@/models/store.model";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";
import Link from "next/link";

const StorePg = ({ params }: { params: { rId: string } }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [allProList, setAllProList] = useState<Product[]>([]);
  const [proList, setProList] = useState<Product[]>([]);
  const [offers, setOffers] = useState<any>();
  const [selectOff, setSelectOff] = useState<string>("all");

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/${params.rId}/0/50`;
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
          setProList(pInfo.data);
          setAllProList(pInfo.data);

          const uniqueDiscount = new Set(
            pInfo.data.map((pro: Product) => pro.discount)
          );
          setOffers(Array.from(uniqueDiscount));
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, params.rId]);

  return (
    <>
      {offers && (
        <>
          <nav className="flex gap-3">
            <a
              onClick={() => {
                setSelectOff("all");
                setProList(allProList);
              }}
              className={` text-white px-3 py-px font-medium rounded-md cursor-pointer ${
                selectOff == "all" ? "bg-orange" : "bg-darkGray"
              }`}
            >
              All
            </a>
            {locList.offers.map((offer: string, i: number) => {
              return (
                offers.includes(offer) && (
                  <a
                    onClick={() => {
                      setProList(
                        allProList.filter((pro) => pro.discount == offer)
                      );
                      setSelectOff(offer);
                    }}
                    className={`text-white px-3 py-px font-medium rounded-md cursor-pointer ${
                      selectOff == offer ? "bg-orange" : "bg-darkGray"
                    }`}
                  >
                    {offer}
                  </a>
                )
              );
            })}
          </nav>

          <ul className="flex flex-wrap">
            {proList.map((pro: Product, i: number) => {
              return <StoreTab pro={pro} key={i} />;
            })}
          </ul>
          <div className="text-center mt-3">
            <Link
              href="/cart"
              className="bg-orange hover:bg-darkGray transition-all text-white font-semibold px-4 py-1.5 rounded-2xl"
            >
              Go To Cart
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default StorePg;
