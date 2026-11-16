"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { User } from "@/models/user.model";
import Notify, { showToast } from "@/components/notify";
import { useEffect } from "react";
import syncLogo from "../../../public/images/sync.png";
import Image from "next/image";

export default function LoginPg() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<User>();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("LogInSCCTkn")) {
      router.push("/creators");
    }
  }, [router]);

  const onSubmit = async (data: User) => {
    const apiBase = process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/";
    const endpoint = `${apiBase.endsWith("/") ? apiBase : apiBase + "/"}user/login`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(endpoint, options);
      const logInfo = await res.json();

      if (res.status == 202) {
        showToast("Login Successful!", "success");
        let logTime = new Date();
        logTime.setTime(logTime.getTime() + 30 * 60 * 60 * 24 * 1000);
        localStorage.setItem("LogInSCCTkn", logInfo.token);
        localStorage.setItem("LogInSCCFNm", logInfo.usrName);
        localStorage.setItem("location", logInfo.location);
        localStorage.setItem("LogInSCCTime", logTime.getTime().toString());
        setValue("usrEmail", "");
        setValue("password", "");
        setTimeout(() => {
          router.push("/creators");
        }, 1000);
      } else {
        showToast(logInfo?.error || "Login Failed... Try Again!", "error");
      }
    } catch (error: any) {
      console.error("Login fetch error:", error);
      showToast(error?.message || "Connection failed. Please check backend server.", "error");
    }
  };
  return (
    <main className="bg-landingGradient min-h-lvh flex items-center justify-center">
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
          <span className="text-orange">User</span> Login
        </h1>
        <h3 className="text-center text-black text-xl mb-10">
          Sign in to Continue
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
            <input
              type="email"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("usrEmail", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Password</h4>
            <input
              type="password"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("password", { required: true })}
            />
            <Link
              href="/reset-password"
              className="underline text-sm hover:text-orange"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
          >
            SIGN IN
          </button>
          <p className="text-black text-center mt-2 text-sm">
            Don&apos;t Have Account{" "}
            <Link href="/sign-up" className="underline hover:text-orange">
              Create an Account
            </Link>
          </p>
        </form>
      </aside>
    </main>
  );
}
