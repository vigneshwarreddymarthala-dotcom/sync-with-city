"use client";

import Notify, { showToast } from "@/components/notify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";
import { Product, UpProduct } from "@/models/store.model";
import StoreTabSelect from "@/components/storeTabSelect";
import BzStoreNavigation from "@/components/bzStoreNavigation";

export default function AddStore() {
  const [authToken, setAuthToken] = useState<any>("");
  const [proList, setProList] = useState<Product[]>([]);
  const [upPro, setUpPro] = useState<UpProduct[]>([]);
  const [sOffer, setSOffer] = useState<string>("10%");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInRSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getEventData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/0/12`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      const res: any = await fetch(endpoint, options);
      const eInfo: any = await res.json();
      if (res.status == 200) {
        setProList(eInfo.data);
      }
    };

    if (authToken) getEventData();
  }, [authToken]);

  const changeStatus = (id: string, offer: string) => {
    let newList = upPro.filter((item) => item.id !== id);
    newList.push({ id: id, discount: offer });

    setUpPro(newList);

    setProList((pro: Product[]) =>
      pro.map((item: any) => {
        if (item._id === id) {
          return { ...item, discount: offer };
        }
        return item;
      })
    );
  };

  const onSubmit = async () => {
    try {
      upPro.map(async (pro: UpProduct, i: number) => {
        const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/edit/${pro.id}`;
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify({ discount: pro.discount }),
        };

        const res = await fetch(endpoint, options);
      });

      showToast("Offer Updated!", "success");
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <>
      <Notify />
      <BzStoreNavigation type="business" />
      <div>
        <aside className="bg-lightGray w-full border-gray border rounded p-6 md:p-12">
          <h1 className="text-black font-medium text-3xl uppercase text-center">
            Products in <span className="text-orange">Offer</span>
          </h1>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Select Offer
              </h4>
              <select
                value={sOffer}
                onChange={(e) => setSOffer(e.target.value)}
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              >
                {locList.offers.map((offer: string, i: number) => {
                  return (
                    <option value={offer} key={i}>
                      {offer}
                    </option>
                  );
                })}
              </select>
            </div>
            {proList.length != 0 && (
              <ul className="m-0 p-0 list-none flex flex-wrap">
                {proList.map((pro: Product, i: number) => {
                  return (
                    <StoreTabSelect
                      pro={pro}
                      offer={sOffer}
                      key={i}
                      sltPro={(id, offer) => changeStatus(id, offer)}
                    />
                  );
                })}
              </ul>
            )}
            <button
              type="submit"
              onClick={onSubmit}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              Update
            </button>
            {/* <p className="text-center mt-3 text-sm">
              <Link
                href="/e-store/store/offers"
                className="text-black hover:text-orange no-underline"
              >
                &larr; Back to List
              </Link>
            </p> */}
          </form>
        </aside>
      </div>
    </>
  );
}
