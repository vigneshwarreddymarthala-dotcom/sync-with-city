"use client";

import Image from "next/image";
import Link from "next/link";
import syncLogo from "../../../public/images/sync.png";
import { useForm } from "react-hook-form";
import { User, VerifyUser } from "@/models/user.model";
import Notify, { showToast } from "@/components/notify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import locList from "@/db/location.json";

export default function RegisterPg() {
  const [isVerify, setIsVerify] = useState(false);
  const [listYr, setListYr] = useState<Number[]>([]);
  const [listDays, setListDays] = useState<Number[]>([]);
  const [listMonth, setListMonth] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [selectedYr, setSelectedYr] = useState("1980");
  const [selectedMth, setSelectedMth] = useState("1");
  const [selectedDay, setSelectedDay] = useState("1");
  const {
    register,
    setValue: setValue1,
    handleSubmit,
    reset,
    getValues,
  } = useForm<User>();
  const {
    register: register1,
    setValue,
    handleSubmit: handleSubmit1,
  } = useForm<VerifyUser>();

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("LogInSCCTkn")) {
      router.push("/creators");
    }
  }, [router]);

  useEffect(() => {
    const currentYr = new Date().getFullYear();
    let yr: Number[] = [];
    for (let i = 1960; i <= currentYr; i++) {
      yr.push(i);
    }
    setListYr(yr);
  }, []);

  const handlerYear = (yr: string) => {
    setSelectedYr(yr);
    calDays(yr, selectedMth);
    setValue1("dob", `${selectedDay}-${selectedMth}-${yr}`);
  };

  const handlerMonth = (mth: string) => {
    setSelectedMth(mth);
    calDays(selectedYr, mth);
    setValue1("dob", `${selectedDay}-${mth}-${selectedYr}`);
  };

  const handlerDay = (day: string) => {
    setSelectedDay(day);
    setValue1("dob", `${day}-${selectedMth}-${selectedYr}`);
  };

  const calDays = (yr: string, mth: string) => {
    var daysInMonth = new Date(parseInt(yr), parseInt(mth), 0).getDate();

    let days: Number[] = [];
    for (var i = 1; i <= 31; i++) {
      if (i <= daysInMonth) {
        days.push(i);
      }
    }
    setListDays(days);
  };

  const onSubmit = async (data: User) => {
    const apiBase = process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/";
    const endpoint = `${apiBase.endsWith("/") ? apiBase : apiBase + "/"}user`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(endpoint, options);
      const msg = await res.json();

      if (res.status == 202) {
        showToast("Account Created Successfully! Welcome!", "success");
        if (msg.token) {
          let logTime = new Date();
          logTime.setTime(logTime.getTime() + 30 * 60 * 60 * 24 * 1000);
          localStorage.setItem("LogInSCCTkn", msg.token);
          localStorage.setItem("LogInSCCFNm", msg.usrName);
          localStorage.setItem("location", msg.location || "Berlin");
          localStorage.setItem("LogInSCCTime", logTime.getTime().toString());
          setTimeout(() => {
            router.push("/creators");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/sign-in");
          }, 1000);
        }
      } else {
        showToast(msg?.error || "Registration Failed... Try Again!", "error");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      showToast(error?.message || "Registration request failed", "error");
    }
  };

  const onVerify = async (data: VerifyUser) => {
    const apiBase = process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/";
    const endpoint = `${apiBase.endsWith("/") ? apiBase : apiBase + "/"}user/verify`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(endpoint, options);
      const msg = await res.json();

      if (res.status == 200) {
        showToast("Verified Successful!", "success");
        showToast("Login to Continue!", "success");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } else {
        showToast("Verification Failed... Try Again!", "error");
      }
    } catch (error: any) {
      console.error("Verify error:", error);
      showToast(error?.message || "Verification request failed", "error");
    }
  };

  return (
    <main className="bg-landingGradient min-h-lvh flex items-center justify-center py-4">
      <Notify />
      <aside className="bg-white bg-opacity-75 max-w-xl w-full border-white border-2 rounded p-6 md:p-12">
        <div className="flex justify-center mb-5">
          <Link href="/">
            <Image
              src={syncLogo}
              alt="Sync With City"
              width={120}
              height={100}
              className="w-full h-auto"
            />
          </Link>
        </div>
        <h1 className="text-black font-medium text-3xl uppercase text-center mb-2">
          <span className="text-orange">User</span> Registration
        </h1>
        <h3 className="text-center text-black text-xl mb-10">
          Sign up to Continue
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Name</h4>
            <input
              type="text"
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("fullName", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
            <input
              type="email"
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("usrEmail", { required: true })}
            />
            {/* <p className="text-xs text-darkGray">
              Please register with university email address
            </p> */}
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Company</h4>
            <input
              type="text"
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("company", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Location in Germany
            </h4>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("location", { required: true })}
            >
              <option value="">Select Your Location</option>
              {locList.location.map((loc: string, i: number) => {
                return (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Native Indian Location
            </h4>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("locationIndia")}
            >
              <option>Select Indian Location</option>
              {locList.india.map((loc: any, i: number) => {
                return (
                  <option value={loc.name} key={i}>
                    {loc.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Language</h4>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("language")}
            >
              <option value="-">Select Your Mother Tongue</option>
              {locList.language.map((lng: any, i: number) => {
                return (
                  <option value={lng.name} key={i}>
                    {lng.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Password</h4>
            <input
              type="password"
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("password", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Confirm Password
            </h4>
            <input
              type="password"
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("confirmPassword", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Date of Birth
            </h4>
            <div className="flex gap-2">
              <select
                onChange={(e) => handlerYear(e.target.value)}
                value={selectedYr}
                className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              >
                <option value="" disabled>
                  Year
                </option>
                {listYr.map((yr: Number, i: number) => {
                  return (
                    <option value={yr.toString()} key={i}>
                      {yr.toString()}
                    </option>
                  );
                })}
              </select>

              <select
                onChange={(e) => handlerMonth(e.target.value)}
                value={selectedMth}
                className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              >
                <option value="" disabled>
                  Month
                </option>
                {listMonth.map((mth: string, i: number) => {
                  return (
                    <option value={i + 1} key={i}>
                      {mth}
                    </option>
                  );
                })}
              </select>
              <select
                onChange={(e) => handlerDay(e.target.value)}
                value={selectedDay}
                className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              >
                <option value="" disabled>
                  Day
                </option>
                {listDays.map((day: Number, i: number) => {
                  return (
                    <option value={i + 1} key={i}>
                      {day.toString()}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
          >
            SIGN UP
          </button>
          <p className="text-black text-center mt-2 text-sm">
            Already Have Account?{" "}
            <Link href="/sign-in" className="underline hover:text-orange">
              Sign In
            </Link>
          </p>
        </form>
      </aside>
      {isVerify && (
        <section className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
          <aside className="bg-lightGray w-full max-w-lg border-gray border rounded p-6 md:p-12">
            <div className="flex justify-center mb-5">
              <Link href="/">
                <Image
                  src={syncLogo}
                  alt="Sync With City"
                  width={120}
                  height={100}
                  className="w-full h-auto"
                />
              </Link>
            </div>
            <h1 className="text-black font-medium text-3xl uppercase text-center mb-2">
              <span className="text-orange">Verify</span> E-mail
            </h1>
            <form onSubmit={handleSubmit1(onVerify)}>
              <div className="my-3">
                <h4 className="uppercase text-black font-light mb-1">OTP</h4>
                <input
                  type="text"
                  className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
                  {...register1("otp", { required: true })}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
              >
                VERIFY
              </button>
            </form>
          </aside>
        </section>
      )}
    </main>
  );
}
