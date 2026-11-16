"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

const ProSearch = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    if (data.loc != "") router.push(`/store/${data.loc}/${data.cate}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-1 gap-2 my-2">
          <div className="w-1/2">
            <select
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("loc")}
            >
              <option value="-">Search by Location</option>
              {locList.location.map((loc: string, i: number) => {
                return (
                  <option value={loc} key={i}>
                    {loc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-1/2">
            <select
              className="w-full bg-white text-black border border-gray text-base rounded outline-none px-3 py-2"
              {...register("cate")}
            >
              <option value="-">Search by Category</option>
              {locList.proCategory.map((cate: string, i: number) => {
                return (
                  <option value={cate} key={i}>
                    {cate}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange text-white py-2 w-full rounded"
        >
          Search Product
        </button>
      </form>
    </>
  );
};

export default ProSearch;
