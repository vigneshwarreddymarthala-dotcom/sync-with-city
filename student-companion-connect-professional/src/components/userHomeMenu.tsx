import Link from "next/link";
import { usePathname } from "next/navigation";

const UsrHomeMenu = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 mb-5">
      <Link
        href={`/creators`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/creators"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        } `}
      >
        Posts
      </Link>
      <Link
        href={`/creators/news`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/creators/news"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        }`}
      >
        News
      </Link>
      <Link
        href={`/creators/offers`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/creators/offers"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        }`}
      >
        Offers
      </Link>
      <Link
        href={`/discover`}
        className={`w-1/2 text-center py-1 text-base md:text-lg border-b-2 ${
          pathname === "/discover"
            ? "border-b-orange text-orange font-semibold"
            : "border-b-lDGray"
        }`}
      >
        Discover
      </Link>
    </div>
  );
};

export default UsrHomeMenu;
