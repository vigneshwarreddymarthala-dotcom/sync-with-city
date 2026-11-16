"use client";

import Notify, { showToast } from "@/components/notify";
import { Cart, Product } from "@/models/store.model";
import { format, isBefore } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductDetails = ({ params }: { params: { id: string } }) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [proInfo, setProInfo] = useState<Product>();
  const [qty, setQty] = useState<string>("1");

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getEvent = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/${params.id}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();

        if (res.status == 200) setProInfo(rInfo);
        else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getEvent();
  }, [authToken, params.id]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  const proValid = (date: string, time: string, qty: string) => {
    if (date && time) {
      if (!expireEvent(date, time)) {
        if (qty) {
          if (parseInt(qty) > 1) return true;
          else return false;
        } else return true;
      } else {
        return false;
      }
    } else return true;
  };

  const addToCart = async () => {
    if (proInfo) {
      const disPrice =
        (parseFloat(proInfo.price) * parseFloat(proInfo.discount)) / 100;
      const cartInfo = {
        proId: proInfo._id,
        rId: proInfo.rId,
        proName: proInfo.proName,
        category: proInfo.category,
        images: proInfo.images,
        qty: qty,
        price: proInfo.price,
        disPrice: disPrice.toString(),
      };

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}cart/add`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify(cartInfo),
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: any = await res.json();

        if (res.status == 202) {
          showToast(rInfo.msg, "success");
          let timer = setTimeout(() => {
            router.push("/cart");
            clearInterval(timer);
          }, 2000);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <section className="container mx-auto flex justify-center">
      <Notify />
      {proInfo && (
        <>
          <div className="w-full max-w-lg mt-1 mb-5 px-2">
            <div className="relative">
              {proInfo.images && (
                <Image
                  src={getImgPath(proInfo.images)}
                  alt={proInfo.proName}
                  width={300}
                  height={250}
                  className="w-full h-80 object-cover object-center rounded mb-3"
                />
              )}
            </div>

            <h2 className="font-semibold text-3xl text-orange">
              {proInfo.proName}
            </h2>
            <p className="text-black text-base">
              <strong className="font-bold text-black text-xs">
                Description
              </strong>
              <br />
              {proInfo.details}
            </p>
            <h3 className="my-4 font-medium flex gap-2 items-center">
              <strong className="text-orange">Location:</strong>
              <span>{proInfo.location}</span>
            </h3>
            {proInfo.qty && parseInt(proInfo.qty) > 0 && (
              <h3 className="my-4 font-medium flex gap-2 items-center">
                <strong className="text-orange">Quantity:</strong>
                <span>{proInfo.qty}</span>
              </h3>
            )}
            {parseInt(proInfo.qty) == 0 && (
              <h3 className="my-4 text-orange font-medium flex gap-2 items-center">
                Out Of Stock
              </h3>
            )}
            {proInfo.date && proInfo.time && (
              <h3 className="my-4 font-medium flex gap-2 items-center">
                <strong className="text-orange">Valid Till:</strong>
                {format(proInfo.date, "EEE, do MMM")} | {proInfo.time}
              </h3>
            )}
            <h3 className="my-4 text-3xl text-orange font-semibold">
              &euro; {proInfo.price}
            </h3>
            {proInfo.date && proInfo.time && (
              <>
                {expireEvent(proInfo.date, proInfo.time) && (
                  <h3 className="my-4 text-4xl text-red font-semibold text-center">
                    Product Expired!
                  </h3>
                )}
              </>
            )}

            {proValid(proInfo.date, proInfo.time, proInfo.qty) && (
              <>
                {parseInt(proInfo.qty) >= 1 && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="w-1/2">
                      <strong>QTY:</strong>
                      <select
                        onChange={(e) => setQty(e.target.value)}
                        className="ml-2 w-16 border bg-white bg-opacity-0 border-lDGray text-center py-2 rounded-md"
                      >
                        {parseInt(proInfo.qty) >= 1 && (
                          <option value="1">1</option>
                        )}
                        {parseInt(proInfo.qty) >= 2 && (
                          <option value="2">2</option>
                        )}
                        {parseInt(proInfo.qty) >= 3 && (
                          <option value="3">3</option>
                        )}
                        {parseInt(proInfo.qty) >= 4 && (
                          <option value="4">4</option>
                        )}
                        {parseInt(proInfo.qty) >= 5 && (
                          <option value="5">5</option>
                        )}
                        {parseInt(proInfo.qty) >= 6 && (
                          <option value="6">6</option>
                        )}
                        {parseInt(proInfo.qty) >= 7 && (
                          <option value="7">7</option>
                        )}
                        {parseInt(proInfo.qty) >= 8 && (
                          <option value="8">8</option>
                        )}
                        {parseInt(proInfo.qty) >= 9 && (
                          <option value="9">9</option>
                        )}
                        {parseInt(proInfo.qty) >= 10 && (
                          <option value="10">10</option>
                        )}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <a
                        className="w-full cursor-pointer block text-center bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                        onClick={addToCart}
                      >
                        Add To Cart
                      </a>
                    </div>
                  </div>
                )}
                {parseInt(proInfo.qty) <= 0 && (
                  <h5 className="text-center text-lg font-bold text-darkGray py-1.5">
                    Out of Stock
                  </h5>
                )}
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProductDetails;
