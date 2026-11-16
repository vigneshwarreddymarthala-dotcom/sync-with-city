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
    <nav className="mt-2 mb-4 flex border-b border-slate-200 overflow-x-auto scrollbar-none w-full">
      <Link
        className={`flex-1 min-w-[120px] text-center py-2.5 px-3 text-xs md:text-sm border-b-2 font-semibold transition whitespace-nowrap ${
          isFindTab
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-slate-600 hover:text-orange"
        } `}
        href="/friends/all/-/-"
      >
        🇮🇳 Find Friends
      </Link>
      <Link
        className={`flex-1 min-w-[110px] text-center py-2.5 px-3 text-xs md:text-sm border-b-2 font-semibold transition whitespace-nowrap ${
          pathname === "/friends"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-slate-600 hover:text-orange"
        } `}
        href="/friends"
      >
        My Friends
      </Link>
      <Link
        className={`flex-1 min-w-[130px] text-center py-2.5 px-3 text-xs md:text-sm border-b-2 font-semibold transition whitespace-nowrap ${
          pathname === "/friends/request"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-slate-600 hover:text-orange"
        } `}
        href="/friends/request"
      >
        Friend Requests
      </Link>
      <Link
        className={`flex-1 min-w-[90px] text-center py-2.5 px-3 text-xs md:text-sm border-b-2 font-semibold transition whitespace-nowrap ${
          pathname === "/friends/clubs"
            ? "border-b-orange text-orange font-bold"
            : "border-b-transparent text-slate-600 hover:text-orange"
        } `}
        href="/friends/clubs"
      >
        Clubs
      </Link>
    </nav>
  );
};

export default FrdNavigation;
