import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, isBefore } from "date-fns";
import { Product } from "@/models/store.model";
import Notify, { showToast } from "./notify";
import { useEffect, useState } from "react";

const StoreTab = ({ pro }: { pro: Product }) => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<any>("");
  const [isCart, setIsCart] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expirePro = (date: string, time: string) => {
    const today = new Date();
    if (date && time) {
      if (isBefore(date + " " + time, today)) return true;
      else return false;
    } else return false;
  };

  const viewDetails = () => {
    router.push(`/store/view/${pro._id}`);
  };

  const addToCart = async (proInfo: Product) => {
    if (proInfo) {
      const disPrice =
        (parseFloat(proInfo.price) * parseFloat(proInfo.discount)) / 100;
      const cartInfo = {
        proId: proInfo._id,
        rId: proInfo.rId,
        proName: proInfo.proName,
        category: proInfo.category,
        images: proInfo.images,
        qty: "1",
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
          setIsCart(true);
        } else {
          showToast(rInfo, "error");
        }
      } catch (e) {
        showToast(e, "error");
      }
    }
  };

  return (
    <>
      <Notify />
      {!expirePro(pro.date, pro.time) && (
        <li className="w-full sm:w-1/2  text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden p-2">
          <div className="bg-white shadow-gray shadow-md">
            <div onClick={viewDetails} className="px-2 md:px-3 py-2">
              {pro.images && (
                <Image
                  src={getImgPath(pro.images)}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover object-center rounded-md"
                />
              )}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <small className="text-xs font-semibold text-white bg-orange px-1 py rounded">
                    {pro.category}
                  </small>
                  {pro.discount && (
                    <span className="text-orange font-bold text-sm">
                      {pro.discount} OFF
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg leading-6 text-black mb-2">
                  {pro.proName}
                </h3>
              </div>
            </div>
            {parseInt(pro.qty) >= 1 && (
              <>
                {!isCart && (
                  <a
                    onClick={() => addToCart(pro)}
                    className="block bg-orange text-white text-sm font-semibold text-center rounded-b py-1.5"
                  >
                    Add To Cart
                  </a>
                )}
                {isCart && (
                  <h5 className="text-center text-sm font-bold text-darkGray py-1.5">
                    Item Already in Cart
                  </h5>
                )}
              </>
            )}
            {parseInt(pro.qty) <= 0 && (
              <h5 className="text-center text-sm font-bold text-darkGray py-1.5">
                Out of Stock
              </h5>
            )}
          </div>
        </li>
      )}
    </>
  );
};

export default StoreTab;
