import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/models/store.model";

const StoreTabSelect = ({
  pro,
  offer,
  sltPro,
}: {
  pro: Product;
  offer: string;
  sltPro: (id: string, offer: string) => void;
}) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    <li className="w-full sm:w-1/2 text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-1  overflow-hidden p-2">
      <label className="px-4 md:px-6 py-2 block bg-white shadow-gray shadow-md relative cursor-pointer">
        <input
          type="checkbox"
          className="absolute right-0 top-0"
          checked={offer == pro.discount ? true : false}
          onChange={(e) => sltPro(pro._id, e.target.checked ? offer : "")}
        />
        {pro.images && (
          <Image
            src={getImgPath(pro.images)}
            alt=""
            width={200}
            height={200}
            className="w-full h-32 object-cover object-center rounded-md"
          />
        )}
        <div className="mt-2">
          <h3 className="font-semibold text-lg leading-6 text-black mb-2">
            <small className="text-xs font-semibold text-white bg-orange px-1 py rounded">
              {pro.category}
            </small>
            <br />
            {pro.proName}
          </h3>
        </div>
      </label>
    </li>
  );
};

export default StoreTabSelect;
