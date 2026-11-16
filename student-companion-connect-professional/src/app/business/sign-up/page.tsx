"use client";

import Image from "next/image";
import Link from "next/link";
import syncLogo from "../../../../public/images/sync.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Notify, { showToast } from "@/components/notify";
import { CreatorLogin, VerifyCreator } from "@/models/creator.model";

export default function RRegisterPg() {
  const [isVerify, setIsVerify] = useState(false);
  const { register, handleSubmit, getValues } = useForm<CreatorLogin>({
    defaultValues: {
      status: false,
    },
  });
  const {
    register: register1,
    setValue,
    handleSubmit: handleSubmit1,
  } = useForm<VerifyCreator>();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("LogInRSCCTkn")) {
      router.push("/business/profile");
    }
  });

  const onSubmit = async (data: CreatorLogin) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner`;
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
        showToast("Registration Successful!", "success");
        showToast("Verify to E-mail!", "success");
        setValue("usrEmail", getValues("usrEmail"));
        setIsVerify(true);
      } else {
        showToast("Registration Failed... Try Again!", "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const onVerify = async (data: VerifyCreator) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}owner/verify`;
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
        let timer = setTimeout(() => {
          router.push("/business");
          clearInterval(timer);
        }, 2000);
      } else {
        showToast("Verification Failed... Try Again!", "error");
      }
    } catch (error) {
      showToast(error, "error");
    }
  };
  return (
    <main className="container px-2 mx-auto min-h-lvh flex items-center justify-center">
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
          <small className="text-xl text-orange">Create New</small>
          <br />
          Business Account
        </h1>
        <h3 className="text-center text-black text-xl mb-10">
          Sign Up to Continue
        </h3>
        <form>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Owner Name</h4>
            <input
              type="text"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("fullName", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">E-mail</h4>
            <input
              type="email"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("usrEmail", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              What Are You?
            </h4>
            <select
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("accType", { required: true })}
            >
              <option value="Business">Business</option>
              <option value="Activity">Activity</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Club">Club</option>
            </select>
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">Password</h4>
            <input
              type="password"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("password", { required: true })}
            />
          </div>
          <div className="my-3">
            <h4 className="uppercase text-black font-light mb-1">
              Confirm Password
            </h4>
            <input
              type="password"
              className="w-full bg-white border border-gray text-base rounded outline-none px-3 py-2"
              {...register("confirmPassword", { required: true })}
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full mt-2 bg-orange py-2 px-3 rounded border-none transition font-medium text-base text-white hover:text-black"
          >
            SIGN UP
          </button>
          <p className="text-black text-center mt-2 text-sm">
            Already Have Account?{" "}
            <Link href="/business" className="underline hover:text-orange">
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
            <form>
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
                onClick={handleSubmit1(onVerify)}
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
