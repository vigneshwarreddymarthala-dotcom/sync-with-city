import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showToast } from "./notify";
import { format } from "date-fns";
import { Order } from "@/models/booking.model";
import Image from "next/image";
import { Creator } from "@/models/creator.model";

const BzOrderTab = ({
  type,
  bk,
  isUsr,
  authToken,
  bCancel,
}: {
  type: string;
  bk: Order;
  isUsr: boolean;
  authToken: any;
  bCancel: (id: string) => void;
}) => {
  const [bkDetails, setBkDetails] = useState(false);
  const [store, setStore] = useState<Creator>();
  const router = useRouter();

  useEffect(() => {
    const getStoreName = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/${bk.rId}`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
        };

        const res = await fetch(endpoint, options);
        const cInfo = await res.json();

        if (res.status == 200) setStore(cInfo);
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && bk.rId) getStoreName();
  }, [authToken, bk.rId]);

  const startConversation = async () => {
    try {
      if (isUsr) {
        const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/restaurant`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify({
            usrId: bk.uId,
            rName: store?.rName,
            usrName: bk.yrName,
          }),
        };

        const res = await fetch(endpoint, options);
        const cInfo = await res.json();

        if (res.status == 202) {
          router.push(`${type}/message/${cInfo}`);
        } else {
          showToast(cInfo, "error");
        }
      } else {
        const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}conversation/user`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify({
            rId: bk.rId,
            rName: store?.rName,
            usrName: bk.yrName,
          }),
        };

        const res = await fetch(endpoint, options);
        const cInfo = await res.json();

        if (res.status == 202) {
          router.push(`/message/${cInfo}`);
        } else {
          showToast(cInfo, "error");
        }
      }
    } catch (e) {
      showToast(e, "error");
    }
  };

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    <>
      <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
        <div className="px-4 md:px-6 pt-5 flex justify-between items-center">
          <div className="flex justify-between items-center w-5/6">
            {bk.images && (
              <Image
                src={getImgPath(bk.images)}
                alt=""
                width={200}
                height={200}
                className="w-1/6 h-12 object-cover object-center rounded-md"
              />
            )}
            <div className="w-5/6 pl-4 flex justify-center items-center">
              <h3 className="font-semibold text-lg leading-6 text-black mb-2">
                {bk.proName}
                <br />
                <small className="text-xs font-semibold text-white bg-orange px-1 py rounded">
                  {bk.category}
                </small>
              </h3>

              <h4 className="ml-auto w-16 border border-lDGray text-center py-1 rounded-md">
                {bk.qty}
              </h4>
            </div>
          </div>

          <div className="w-1/6 flex justify-end">
            {bk.status == "Cancelled" && (
              <span className="text-red font-semibold">Cancelled</span>
            )}
            {bk.status != "Cancelled" && (
              <svg
                width="128"
                height="104"
                viewBox="0 0 128 104"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
              >
                <path
                  d="M108.411 0L43.4344 65.002L19.149 40.7166L0 59.8906L43.4094 103.3L49.0195 97.7149L127.585 19.149L108.411 0Z"
                  fill="#41AD49"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="text-sm md:text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
          <a
            onClick={() => setBkDetails(true)}
            className="text-white hover:text-black transition"
          >
            Product Details
          </a>
          {isUsr && (
            <Link
              href={`${type}/user/${bk.uId}`}
              className="text-white hover:text-black transition"
            >
              User Profile
            </Link>
          )}
          {!isUsr && (
            <Link
              href={`/creators/${bk.rId}/store`}
              className="text-white hover:text-black transition"
            >
              Store Profile
            </Link>
          )}
          <a
            onClick={() => startConversation()}
            className="text-white hover:text-black transition"
          >
            Message
          </a>
          {bk.status != "Cancelled" && (
            <a
              onClick={() => bCancel(bk._id)}
              className="text-white hover:text-black transition"
            >
              Cancel
            </a>
          )}
        </div>
      </li>
      {bkDetails && (
        <section className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <aside className="bg-lightGray w-full max-w-lg border-gray border rounded p-6 md:p-8">
            <h3 className="text-center mb-3 text-xl text-orange font-semibold border-b-2 pb-2 border-orange">
              Order Details
            </h3>
            <div>
              <h4 className="font-semibold text-base">
                <strong className="text-darkGray">Product Name: </strong>
                <span className="text-orange">{bk.proName}</span>
              </h4>
              <p className="text-sm text-black">
                <strong className="text-darkGray">Quantity:</strong>
                <span className="font-semibold text-orange"> {bk.qty}</span>
              </p>
              <h4 className="font-semibold text-base mt-4">
                <strong className="text-darkGray">Name: </strong>
                <span className="text-orange">{bk.yrName}</span>
              </h4>

              <p className="text-sm text-black ">
                <strong className="text-darkGray">E-mail: </strong>
                <span className="font-semibold text-orange">{bk.email}</span>
              </p>

              <p className="text-sm text-black">
                <strong className="text-darkGray">Contact No.: </strong>
                <span className="font-semibold text-orange">{bk.phNo}</span>
              </p>

              <p className="text-sm text-black">
                <strong className="text-darkGray">Order On: </strong>
                <span className="font-semibold text-orange">
                  {format(bk.createdAt, "dd-MM-yyyy hh:mm a")}
                </span>
              </p>

              <p className="text-sm text-black">
                <strong className="text-darkGray">Payment Mode: </strong>
                <span className="font-semibold text-orange">
                  {bk.paymentOpt}
                </span>
                <br />
                <strong className="text-darkGray">Status: </strong>
                <span className="font-semibold text-green">{bk.payStatus}</span>
              </p>
            </div>
            <a
              onClick={() => setBkDetails(false)}
              className="cursor-pointer bg-orange block w-full text-center font-medium text-white hover:text-black py-2 rounded-lg transition mt-3"
            >
              Done
            </a>
          </aside>
        </section>
      )}
    </>
  );
};

export default BzOrderTab;
