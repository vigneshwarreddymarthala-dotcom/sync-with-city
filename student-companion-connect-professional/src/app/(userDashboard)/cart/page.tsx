"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notify, { showToast } from "@/components/notify";
import { useForm } from "react-hook-form";
import { Order } from "@/models/booking.model";
import { Cart } from "@/models/store.model";
import StoreProTab from "@/components/storeProTab";
import Link from "next/link";

export default function Booking({
  params,
}: {
  params: { rId: string; id: string };
}) {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [cartData, setCartData] = useState<Cart[]>([]);
  const [myInfo, setMyInfo] = useState<string>();
  const { register, handleSubmit, setValue, watch } = useForm<Order>({
    defaultValues: {
      paymentOpt: "Paid",
      status: "Ordered",
      payStatus: "Paid",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      try {
        const eEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}my-cart`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const eRes: any = await fetch(eEndpoint, options);
        const eInfo: any = await eRes.json();

        if (eRes.status == 200) {
          setCartData(eInfo.data);
        }

        const endpointM = `${process.env.NEXT_PUBLIC_API_PATH}user`;
        const optionsM = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const mRes: any = await fetch(endpointM, optionsM);
        const mInfo: any = await mRes.json();

        setMyInfo(mInfo._id);
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken) getRData();
  }, [authToken, params, setValue]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const delItem = async (id: string) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}cart/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    };

    try {
      const res: any = await fetch(endpoint, options);
      const msg: any = await res.json();
      showToast(msg, "success");
      const newItems = cartData.filter((item: Cart) => item._id !== id);
      setCartData(newItems);
    } catch (e) {
      showToast(e, "error");
    }
  };

  const updateQty = (id: string, qty: string) => {
    setCartData((bk: Cart[]) =>
      bk.map((item: any) => {
        if (item._id === id) {
          return { ...item, qty: qty };
        }
        return item;
      })
    );
  };

  const updateBooking = (pay: string) => {
    cartData.map((pro: Cart, i: number) => {
      setValue("rId", pro.rId);
      setValue("proId", pro.proId);
      setValue("proName", pro.category);
      setValue("category", pro.category);
      setValue("images", pro.images);
      setValue("qty", pro.qty);
      setValue("price", pro.price);
      setValue("disPrice", pro.disPrice);

      handleSubmit(payNow)();
    });
    router.push("/my-orders");
  };

  const payNow = async (data: Order) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}order`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(data),
    };

    try {
      const res: any = await fetch(endpoint, options);
      const bk: any = await res.json();

      if (res.status == 202) {
        showToast(bk, "success");
        // router.push(
        //   `/my-orders`
        // );
      } else {
        showToast("Booking Failed!", "error");
      }
    } catch (e) {
      showToast(e, "error");
    }
  };
  return (
    <>
      <Notify />
      <StoreProTab />
      <>
        {!cartData ||
          (cartData.length == 0 && (
            <>
              <h2 className="text-center text-2xl text-orange font-bold mt-10">
                Cart is Empty!
              </h2>
            </>
          ))}
        {cartData && cartData.length != 0 && (
          <>
            <ul>
              {cartData.map((pro: Cart, i: number) => {
                return (
                  <li
                    key={i}
                    className="w-full  text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden p-2"
                  >
                    <div className="px-4 md:px-6 py-2 bg-white shadow-gray shadow-md flex justify-between items-center">
                      {pro.images && (
                        <Image
                          src={getImgPath(pro.images)}
                          alt=""
                          width={200}
                          height={200}
                          className="w-1/6 h-12 object-cover object-center rounded-md"
                        />
                      )}
                      <div className="w-5/6 pl-4 flex justify-center items-center">
                        <h3 className="font-semibold text-lg leading-6 text-black mb-2">
                          {pro.proName}
                          <br />
                          <small className="text-xs font-semibold text-white bg-orange px-1 py rounded">
                            {pro.category}
                          </small>
                        </h3>

                        <div className="ml-auto flex items-center gap-2">
                          <a
                            className="text-3xl text-orange font-bold cursor-pointer"
                            onClick={() =>
                              updateQty(
                                pro._id,
                                (parseInt(pro.qty) + 1).toString()
                              )
                            }
                          >
                            +
                          </a>
                          <h4 className="w-16 border border-lDGray bg-white bg-opacity-0 text-center py-1 rounded-md">
                            {pro.qty}
                          </h4>
                          <a
                            className="text-3xl text-orange font-bold cursor-pointer"
                            onClick={() =>
                              updateQty(
                                pro._id,
                                parseInt(pro.qty) > 1
                                  ? (parseInt(pro.qty) - 1).toString()
                                  : "1"
                              )
                            }
                          >
                            -
                          </a>
                        </div>

                        <a onClick={() => delItem(pro._id)} className="ml-4">
                          <svg
                            width="232"
                            height="298"
                            viewBox="0 0 232 298"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-orange w-5 h-5"
                          >
                            <path d="M16.5556 264.889C16.5556 283.1 31.4556 298 49.6667 298H182.111C200.322 298 215.222 283.1 215.222 264.889V66.2222H16.5556V264.889ZM231.778 16.5556H173.833L157.278 0H74.5L57.9444 16.5556H0V49.6667H231.778V16.5556Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="text-center my-5">
              <Link
                href={`creators/${cartData[0].rId}/store`}
                className="text-orange font-semibold"
              >
                Add More Items
              </Link>
            </div>
            <form action="" className="my-5">
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">Name</h4>
                <input
                  type="text"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("yrName", { required: true })}
                />
              </div>

              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  E-mail Address
                </h4>
                <input
                  type="email"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">
                  Contact Number
                </h4>
                <input
                  type="tel"
                  className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                  {...register("phNo", { required: true })}
                />
              </div>
              {/* <h4 className="font-semibold uppercase text-black mb-1">
                Pay With
              </h4> */}
              {/* {myInfo != cartData._id && ( */}
              <>
                {/* <button
                    type="button"
                    onClick={() => updateBooking("PayPal")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBooking("Apple Pay")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBooking("Card")}
                    className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                  >
                    Credit or Debit Card
                  </button> */}
                <button
                  type="button"
                  onClick={() => updateBooking("Reserved")}
                  className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
                >
                  Place Order
                </button>
              </>
              {/* )} */}
            </form>
          </>
        )}
      </>
    </>
  );
}
