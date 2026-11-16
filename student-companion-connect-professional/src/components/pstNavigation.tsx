import Link from "next/link";
import { usePathname } from "next/navigation";

const PstNavigation = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 mb-5">
      <Link
        href={`/events`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/events"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Posts
      </Link>
      <Link
        href={`/my-booking`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/my-booking"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        My Bookings
      </Link>
      <Link
        href={`/news`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/news"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        News
      </Link>
    </div>
  );
};

export default PstNavigation;
