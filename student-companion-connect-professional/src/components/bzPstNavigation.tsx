import Link from "next/link";
import { usePathname } from "next/navigation";

const BzPstNavigation = ({ type }: { type: string }) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 mb-5">
      <Link
        href={`/${type}/events`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/events`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Posts
      </Link>
      <Link
        href={`/${type}/bookings`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/bookings`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Booking List
      </Link>
      <Link
        href={`/${type}/info`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === `/${type}/info`
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Information
      </Link>
    </div>
  );
};

export default BzPstNavigation;
