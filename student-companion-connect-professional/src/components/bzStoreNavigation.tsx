import Link from "next/link";
import { usePathname } from "next/navigation";

const BzStoreNavigation = ({ type }: { type: string }) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 mb-5">
      <Link
        href={`/${type}/store`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/store`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Products
      </Link>
      <Link
        href={`/${type}/store/offers`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/store/offers`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Offers
      </Link>
      <Link
        href={`/${type}/store/orders`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/store/orders`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Orders
      </Link>
    </div>
  );
};

export default BzStoreNavigation;
