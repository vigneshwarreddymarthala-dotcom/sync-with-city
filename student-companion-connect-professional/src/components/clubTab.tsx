import { Creator } from "@/models/creator.model";
import Image from "next/image";
import Link from "next/link";

const ClubTab = ({ club }: { club: Creator }) => {
  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
      <div className="flex items-center gap-4 flex-1 px-4 md:px-6 pt-5 ">
        {(club.rLogo || (club as any).businessImg) && (
          <Image
            src={getImgPath(club.rLogo || (club as any).businessImg)}
            alt={club.rName || (club as any).businessName || "Club"}
            width={100}
            height={100}
            className="size-24 object-cover object-center rounded-md"
          />
        )}
        <div>
          <h3 className="font-semibold text-2xl">
            {club.rName || (club as any).businessName || "Student Club"}
          </h3>
          <h4 className="text-sm font-medium text-black">{club.location}</h4>
        </div>
      </div>

      <div className="text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
        <Link
          href={`/friends/business/${club.rId}`}
          className="text-white hover:text-black transition"
        >
          View Profile
        </Link>
      </div>
    </li>
  );
};

export default ClubTab;
