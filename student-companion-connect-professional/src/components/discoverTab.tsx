import { Discover } from "@/models/discover.model";
import { isBefore } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DiscoverTab = ({ dis }: { dis: Discover }) => {
  const router = useRouter();
  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_Discover_PATH}uploads/${img}`;
  };

  const expireEvent = (date: string, time: string) => {
    try {
      if (!date) return true;
      const today = new Date();
      const parsed = new Date(date + " " + (time || "23:59"));
      if (isNaN(parsed.getTime())) return true;
      return !isBefore(parsed, today);
    } catch {
      return true;
    }
  };

  const showDetail = (id: string) => {
    router.push(`/discover/${id}`);
  };
  return (
    expireEvent(dis.date, dis.time) && (
      <li className="w-1/2 p-2" onClick={() => showDetail(dis._id)}>
        <div className="bg-white shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md cursor-pointer pt-2 relative">
          <Image
            src={getImgPath(dis.imgPath[0])}
            alt={dis.dName}
            width={100}
            height={100}
            loading="lazy"
            className="w-full h-40 object-contain object-center "
          />
          <h3 className="bg-orange text-white text-center rounded-b-md font-semibold text-lg py-1 px-2 mt-1 absolute bottom-0 left-0 right-0">
            {dis.dName}
          </h3>
        </div>
      </li>
    )
  );
};

export default DiscoverTab;
