import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, isBefore } from "date-fns";
import { Creator } from "@/models/creator.model";

const StoreProfileTab = ({ prof }: { prof: Creator }) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const viewDetails = () => {
    router.push(`/creators/${prof.rId}/store`);
  };

  return (
    prof.category && (
      <li
        onClick={viewDetails}
        className="w-full sm:w-1/2  text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden p-2"
      >
        <div className="px-4 md:px-6 py-2 bg-white shadow-gray shadow-md">
          {prof.rLogo && (
            <Image
              src={getImgPath(prof.rLogo)}
              alt=""
              width={200}
              height={200}
              className="w-full h-32 object-cover object-center rounded-md"
            />
          )}
          <div className="mt-2">
            <h3 className="font-semibold text-lg leading-6 text-black mb-2">
              <small className="text-xs font-semibold text-white bg-orange px-1 py rounded">
                {prof.category}
              </small>
              <br />
              {prof.rName}
            </h3>
          </div>
        </div>
      </li>
    )
  );
};

export default StoreProfileTab;
