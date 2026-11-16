import Image from "next/image";
import { useRouter } from "next/navigation";
import { isBefore } from "date-fns";
import { safeFormat } from "@/utils/date";
import Link from "next/link";
import { Product } from "@/models/store.model";

const StoreModifyTab = ({
  type,
  pro,
  rEvent,
}: {
  type: string;
  pro: Product;
  rEvent: (id: string) => void;
}) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expirePro = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
      <div className="flex items-center gap-4 flex-1 px-4 md:px-6 pt-2 ">
        {pro.images && (
          <Image
            src={getImgPath(pro.images)}
            alt=""
            width={200}
            height={200}
            className="size-24 md:size-32 object-cover object-center rounded-md"
          />
        )}
        <div>
          <h3 className="font-semibold text-lg leading-none text-black mb-2">
            {pro.proName}
          </h3>
          <h4 className="text-xs font-medium text-darkGray flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
            <span>
              <strong>Location:</strong> {pro.location}
            </span>
          </h4>
          <h4 className="text-xs font-medium text-darkGray flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
            <span>
              <strong>Category:</strong> {pro.category}
            </span>
            {pro.date && pro.time && (
              <span className="flex items-center gap-1">
                <strong>Valid Till:</strong> {safeFormat(pro.date, "EEE, do MMM")} |{" "}
                {pro.time}
              </span>
            )}
          </h4>
          <h4 className="text-xs font-medium text-darkGray flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
            {pro.qty && (
              <span>
                <strong>Quantity:</strong> {pro.qty}
              </span>
            )}
            {pro.price && (
              <span className="flex items-center gap-1">
                <strong>Price:</strong> &euro;{pro.price}
              </span>
            )}
          </h4>
          {pro.date && pro.time && (
            <h4 className="flex gap-1 text-orange font-semibold text-sm">
              {expirePro(pro.date, pro.time) && <span>Expired</span>}
            </h4>
          )}
        </div>
      </div>
      <div className="text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
        <Link
          href={`/${type}/store/${pro._id}/edit`}
          className="text-white hover:text-black transition"
        >
          Edit
        </Link>
        <Link
          href={`/${type}/store/${pro._id}/views`}
          className="text-white hover:text-black transition"
        >
          View
        </Link>
        <a
          onClick={() => rEvent(pro._id)}
          className="text-white hover:text-black transition"
        >
          Delete
        </a>
      </div>
    </li>
  );
};

export default StoreModifyTab;
