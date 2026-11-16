"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

const NewsSearch = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    router.push(`/creators/news/${data.location}/${data.category}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-1 my-2 flex-wrap md:flex-nowrap">
          <div className="w-1/2 md:w-2/5">
            <select
              className="w-full bg-white text-black border border-gray text-sm rounded-md outline-none px-3 py-2"
              {...register("location")}
            >
              <option value="-">Search by Location</option>
              {locList.location.map((loc: string, i: number) => {
                return (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-1/2 md:w-2/5 pl-2 md:px-2">
            <select
              className="w-full bg-white text-black border border-gray text-sm rounded-md outline-none px-3 py-2"
              {...register("category")}
            >
              <option value="-">Search by Category</option>
              {locList.category.map((cate: string, i: number) => {
                return (
                  <option value={cate} key={i}>
                    {cate}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            type="submit"
            className="bg-orange text-white w-full md:w-1/5 py-2 mt-2 md:mt-0 rounded-md flex items-center justify-center"
          >
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-white w-5 h-5"
            >
              <path
                d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
};

export default NewsSearch;
