"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FrdNavigation = () => {
  const pathname = usePathname();
  const isFindTab =
    pathname.startsWith("/friends/") &&
    pathname !== "/friends/request" &&
    pathname !== "/friends/clubs";

  return (
    <nav className="mt-2 mb-4 flex justify-between border-b border-gray">
      <Link
        className={`w-1/4 text-center py-2 text-xs md:text-sm border-b-2 font-medium transition ${
          isFindTab
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-black hover:text-orange"
        } `}
        href="/friends/all/-/-"
      >
        🇮🇳 Find Friends
      </Link>
      <Link
        className={`w-1/4 text-center py-2 text-xs md:text-sm border-b-2 font-medium transition ${
          pathname === "/friends"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-black hover:text-orange"
        } `}
        href="/friends"
      >
        My Friends
      </Link>
      <Link
        className={`w-1/4 text-center py-2 text-xs md:text-sm border-b-2 font-medium transition ${
          pathname === "/friends/request"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-black hover:text-orange"
        } `}
        href="/friends/request"
      >
        Friend Requests
      </Link>
      <Link
        className={`w-1/4 text-center py-2 text-xs md:text-sm border-b-2 font-medium transition ${
          pathname === "/friends/clubs"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-black hover:text-orange"
        } `}
        href="/friends/clubs"
      >
        Clubs
      </Link>
    </nav>
  );
};

export default FrdNavigation;
