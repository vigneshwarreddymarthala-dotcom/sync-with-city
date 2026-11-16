"use client";

import Image from "next/image";
import Link from "next/link";
import syncLogo from "../../../../public/images/sync.png";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UserResetPass } from "@/models/user.model";
import Notify, { showToast } from "@/components/notify";
import { useEffect, useState } from "react";

export default function LoginPg() {
  const router = useRouter();
  const [isReset, setIsReset] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    setValue,
  } = useForm<UserResetPass>();

  useEffect(() => {
    if (localStorage.getItem("LogInSSCCTkn")) {
      router.push("/e-store/profile");
    }
  });

  const onSubmit = async (data: any) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/reset`;
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

      if (res.status == 200) {
        showToast(logInfo, "success");
        setIsReset(true);
        setValue("usrEmail", data.usrEmail);
        reset();
      } else {
        showToast(logInfo, "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onSubmitPassword = async (data: UserResetPass) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/reset/pass`;
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

      if (res.status == 200) {
        showToast(logInfo, "success");
        reset1();
        let timer = setTimeout(() => {
          router.push("/e-store");
          clearInterval(timer);
        }, 2000);
      } else {
        showToast(logInfo, "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <main className="container mx-auto px-2 min-h-lvh flex items-center justify-center">
      <Notify />
      {!isReset && (
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
            <span className="text-orange">Reset</span> Password
          </h1>
          <h3 className="text-center text-black text-xl mb-10">
            Registered E-mail to Continue
          </h3>
          <form>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
              <input
                type="email"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register("usrEmail", { required: true })}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              CONTINUE
            </button>
            <p className="text-black text-center mt-2 text-sm">
              Remember Password?{" "}
              <Link href="/e-store" className="underline hover:text-orange">
                Login Now
              </Link>
            </p>
          </form>
        </aside>
      )}
      {isReset && (
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
            <span className="text-orange">Reset</span> Password
          </h1>
          <h3 className="text-center text-black text-xl mb-10">
            OTP with New Password to Continue
          </h3>
          <form>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
              <input
                type="email"
                className="w-full border border-gray text-base rounded outline-none px-3 py-2 bg-gray"
                disabled
                {...register1("usrEmail", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1 ">OTP</h4>
              <input
                type="text"
                className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
                {...register1("otp", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">Password</h4>
              <input
                type="password"
                className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
                {...register1("password", { required: true })}
              />
            </div>
            <div className="my-3">
              <h4 className="uppercase text-black font-light mb-1">
                Confirm Password
              </h4>
              <input
                type="password"
                className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
                {...register1("confirmPassword", { required: true })}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit1(onSubmitPassword)}
              className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
            >
              CONTINUE
            </button>
            <p className="text-black text-center mt-2 text-sm">
              Remember Password?{" "}
              <Link href="/e-store" className="underline hover:text-orange">
                Login Now
              </Link>
            </p>
          </form>
        </aside>
      )}
    </main>
  );
}
