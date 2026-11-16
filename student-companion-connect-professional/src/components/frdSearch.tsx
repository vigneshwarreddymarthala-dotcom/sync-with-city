"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";

const quickIndianStates = [
  { name: "All India 🇮🇳", value: "-" },
  { name: "Telangana", value: "Telangana" },
  { name: "Andhra Pradesh", value: "Andhra Pradesh" },
  { name: "Maharashtra", value: "Maharashtra" },
  { name: "Karnataka", value: "Karnataka" },
  { name: "Tamil Nadu", value: "Tamil Nadu" },
  { name: "Kerala", value: "Kerala" },
  { name: "Gujarat", value: "Gujarat" },
  { name: "Punjab", value: "Punjab" },
  { name: "Delhi", value: "Delhi" },
];

const FrdSearch = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedState, setSelectedState] = useState("-");
  const [selectedLang, setSelectedLang] = useState("-");

  // Sync state with URL parameters
  useEffect(() => {
    if (pathname && pathname.startsWith("/friends/")) {
      const parts = pathname.split("/").filter(Boolean);
      // Expected format: /friends/:city/:state/:lang
      if (parts.length >= 3) {
        const st = parts[2] && parts[2] !== "-" ? decodeURIComponent(parts[2]) : "-";
        setSelectedState(st);
      }
      if (parts.length >= 4) {
        const lg = parts[3] && parts[3] !== "-" ? decodeURIComponent(parts[3]) : "-";
        setSelectedLang(lg);
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

  return (
    <section className="bg-white shadow-sm border border-gray rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-black font-bold text-lg md:text-xl flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <span>Find Indian Friends</span>
        </h2>
        <span className="text-xs bg-orange text-white font-bold px-2.5 py-1 rounded-full shadow-sm">
          Country: India Only 🇮🇳
        </span>
      </div>

      <p className="text-xs text-darkGray mb-3">
        Easily filter Indian students across Germany by <strong>Country</strong>, <strong>State</strong>, and <strong>Language</strong>.
      </p>

      {/* 3 Step Filter: 1. Country (India) -> 2. State -> 3. Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3">
        {/* Filter 1: Country (Starts with only India) */}
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            1. Country
          </label>
          <div className="relative">
            <select
              disabled
              value="India"
              className="w-full bg-orange bg-opacity-10 text-orange font-bold border border-orange border-opacity-40 text-sm rounded-lg px-3 py-2 cursor-not-allowed appearance-none"
            >
              <option value="India">🇮🇳 India (Active)</option>
            </select>
            <span className="absolute right-3 top-2.5 text-xs text-orange font-semibold">
              Locked 🔒
            </span>
          </div>
        </div>

        {/* Filter 2: State */}
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            2. State
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-lightGray text-black border border-gray text-sm rounded-lg px-3 py-2 font-medium focus:border-orange outline-none"
          >
            <option value="-">🇮🇳 All Indian States</option>
            {locList.india.map((loc: any, i: number) => (
              <option value={loc.name} key={i}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Language */}
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            3. Language
          </label>
          <select
            value={selectedLang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="w-full bg-lightGray text-black border border-gray text-sm rounded-lg px-3 py-2 font-medium focus:border-orange outline-none"
          >
            <option value="-">🗣️ All Languages</option>
            {locList.language.map((lng: any, i: number) => (
              <option value={lng.name} key={i}>
                {lng.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Indian State Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-black">
            Popular States (1-Click):
          </span>
          {(selectedState !== "-" || selectedLang !== "-") && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-orange font-semibold hover:underline"
            >
              Reset Filters ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {quickIndianStates.map((st, i) => {
            const isActive = selectedState === st.value;
            return (
              <button
                key={i}
                type="button"
                onClick={() => applyFilters(st.value, selectedLang)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition shadow-sm ${
                  isActive
                    ? "bg-orange text-white border border-orange"
                    : "bg-white border border-gray text-black hover:border-orange hover:text-orange"
                }`}
              >
                {st.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FrdSearch;
