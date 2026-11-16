"use client";

import Image from "next/image";
import Link from "next/link";
import syncLogo from "../../../public/images/sync.png";
import { useRouter } from "next/navigation";
import Notify, { showToast } from "@/components/notify";
import { useForm } from "react-hook-form";
import { CreatorLogin } from "@/models/creator.model";
import { useEffect } from "react";

export default function RLoginPg() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<CreatorLogin>();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("LogInRSCCTkn")) {
      router.push("/business/profile");
    }
  }, [router]);

  const onSubmit = async (data: CreatorLogin) => {
    const apiBase = process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/";
    const endpoint = `${apiBase.endsWith("/") ? apiBase : apiBase + "/"}owner/login`;
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
        localStorage.setItem("LogInRSCCTkn", logInfo.token);
        localStorage.setItem("LogInRSCCFNm", logInfo.usrName);
        localStorage.setItem("LogInRSCCTime", logTime.getTime().toString());
        setValue("usrEmail", "");
        setValue("password", "");
        setTimeout(() => {
          router.push("/business/profile");
        }, 1000);
      } else {
        showToast(logInfo?.error || "Login Failed... Try Again!", "error");
      }
    } catch (error: any) {
      showToast(error?.message || "Connection failed", "error");
    }
  };

  return (
    <main className="container mx-auto min-h-lvh flex items-center justify-center px-2">
      <Notify />
      <aside className="bg-lightGray max-w-lg w-full border-gray border rounded p-6 md:p-12">
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
          <small className="text-xl text-orange">Business</small>
          <br />
          Dashboard
        </h1>
        <h3 className="text-center text-black text-xl mb-10">
          Sign In to Continue
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
              href="/business/reset-password"
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
            <Link
              href="/business/sign-up"
              className="underline hover:text-orange"
            >
              Create an Account
            </Link>
          </p>
        </form>
      </aside>
    </main>
  );
}
