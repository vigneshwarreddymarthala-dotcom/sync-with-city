"use client";

import Image from "next/image";
import Link from "next/link";
import syncLogo from "../../../public/images/sync.png";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Notify, { showToast } from "@/components/notify";
import { useEffect } from "react";
import { AdminLogin } from "@/models/admin.model";

export default function AdminLogPg() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<AdminLogin>();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("LogInASCCTkn")) {
      router.push("/admin/users");
    }
  }, [router]);

  const onSubmit = async (data: AdminLogin) => {
    const apiBase = process.env.NEXT_PUBLIC_API_PATH || "http://localhost:8002/";
    const endpoint = `${apiBase.endsWith("/") ? apiBase : apiBase + "/"}admin/login`;
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
        localStorage.setItem("LogInASCCTkn", logInfo.token);
        localStorage.setItem("LogInASCCFNm", logInfo.usrName);
        localStorage.setItem("LogInASCCTime", logTime.getTime().toString());
        setValue("usrEmail", "");
        setValue("password", "");
        setTimeout(() => {
          router.push("/admin/users");
        }, 1000);
      } else {
        showToast(logInfo?.error || "Login Failed... Try Again!", "error");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      showToast(error?.message || "Connection failed. Please check backend server.", "error");
    }
  };
  return (
    <main className="container mx-auto px-2 min-h-lvh flex items-center justify-center">
      <Notify />
      <aside className="bg-lightGray max-w-lg w-full border-gray border rounded p-6 md:p-12">
        <div className="flex justify-center mb-5">
          <Link href="/">
            <Image src={syncLogo} alt="Sync with City" width={200} />
          </Link>
        </div>
        <h1 className="text-black font-medium text-3xl uppercase text-center mb-2">
          <span className="text-orange">Admin</span> Login
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
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
          >
            SIGN IN
          </button>
        </form>
      </aside>
    </main>
  );
}
