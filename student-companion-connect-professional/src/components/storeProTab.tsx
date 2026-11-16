"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const StoreProTab = () => {
  const pathname = usePathname();
  return (
    <div className="flex mb-5">
      <Link
        href={"/store"}
        className={`w-1/3 text-center py-2 font-semibold  border-b-2  ${
          pathname === "/store"
            ? "text-orange border-b-orange"
            : "text-black border-b-gray"
        }`}
      >
        Search Store
      </Link>
      <Link
        href={"/cart"}
        className={`w-1/3 text-center py-2 font-semibold border-b-2 ${
          pathname === "/cart"
            ? "text-orange border-b-orange"
            : "text-black border-b-gray"
        }`}
      >
        Cart
      </Link>
      <Link
        href={"/my-orders"}
        className={`w-1/3 text-center py-2 font-semibold border-b-2 ${
          pathname === "/my-orders"
            ? "text-orange border-b-orange"
            : "text-black border-b-gray"
        }`}
      >
        My Orders
      </Link>
    </div>
  );
};

export default StoreProTab;
