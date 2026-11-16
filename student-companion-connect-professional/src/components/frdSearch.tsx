"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";

const FrdSearch = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedState, setSelectedState] = useState("-");
  const [selectedLang, setSelectedLang] = useState("-");

  // Synchronize filter selections with URL parameters
  useEffect(() => {
    if (pathname && pathname.startsWith("/friends/")) {
      const parts = pathname.split("/").filter(Boolean);
      // Expected URL pattern: /friends/:city/:state/:lang
      if (parts.length >= 3) {
        const st = parts[2] && parts[2] !== "-" ? decodeURIComponent(parts[2]) : "-";
        setSelectedState(st);
      } else {
        setSelectedState("-");
      }
      if (parts.length >= 4) {
        const lg = parts[3] && parts[3] !== "-" ? decodeURIComponent(parts[3]) : "-";
        setSelectedLang(lg);
      } else {
        setSelectedLang("-");
      }
    } else {
      setSelectedState("-");
      setSelectedLang("-");
    }
  }, [pathname]);

  const applyFilters = (newState: string, newLang: string) => {
    setSelectedState(newState);
    setSelectedLang(newLang);
    router.push(`/friends/all/${newState}/${newLang}`);
  };

  const handleStateChange = (stateVal: string) => {
    applyFilters(stateVal, selectedLang);
  };

  const handleLangChange = (langVal: string) => {
    applyFilters(selectedState, langVal);
  };

  const handleReset = () => {
    applyFilters("-", "-");
  };

  const isFiltered = selectedState !== "-" || selectedLang !== "-";

  return (
    <section className="bg-white border border-gray rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-black tracking-tight">
            Find Friends
          </h2>
          <p className="text-xs text-darkGray">
            Filter student profiles by country, state, and language.
          </p>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-orange hover:underline flex items-center gap-1 transition"
          >
            Clear Filters ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Country Selector */}
        <div>
          <label className="block text-xs font-medium text-darkGray mb-1">
            Country
          </label>
          <div className="flex items-center justify-between bg-lightGray border border-gray rounded-md px-3 py-2 text-sm text-black font-medium">
            <span>India</span>
            <span className="text-[11px] font-semibold text-orange bg-orange bg-opacity-15 px-2 py-0.5 rounded">
              Selected
            </span>
          </div>
        </div>

        {/* 2. State Selector */}
        <div>
          <label className="block text-xs font-medium text-darkGray mb-1">
            State
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-white text-black border border-gray rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange transition"
          >
            <option value="-">All States</option>
            {locList.india.map((loc: any, i: number) => (
              <option value={loc.name} key={i}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Language Selector */}
        <div>
          <label className="block text-xs font-medium text-darkGray mb-1">
            Language
          </label>
          <select
            value={selectedLang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="w-full bg-white text-black border border-gray rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange transition"
          >
            <option value="-">All Languages</option>
            {locList.language.map((lng: any, i: number) => (
              <option value={lng.name} key={i}>
                {lng.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default FrdSearch;
