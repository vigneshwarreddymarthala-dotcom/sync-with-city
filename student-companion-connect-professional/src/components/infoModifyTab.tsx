import Link from "next/link";
import { safeFormat } from "@/utils/date";
import { BzInfo } from "@/models/info.model";

const InfoModifyTab = ({
  type,
  info,
  rInfo,
}: {
  type: string;
  info: BzInfo;
  rInfo: (id: string) => void;
}) => {
  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
      <div className="px-4 py-2">
        <h3 className="font-semibold text-xl text-orange ">{info.iTitle}</h3>
        <h4 className="text-sm mt-1 font-semibold text-darkGray">
          Type: {info.iType}
        </h4>

        <h4 className="text-sm mt-1 font-semibold text-darkGray">
          Created On: {safeFormat(info.createdAt, "EEE, do MMM")}
        </h4>
      </div>
      <div className="text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
        <Link
          href={`/${type}/info/${info._id}/edit`}
          className="text-white hover:text-black transition"
        >
          Edit
        </Link>
        <Link
          href={`/${type}/info/${info._id}`}
          className="text-white hover:text-black transition"
        >
          View
        </Link>
        <a
          onClick={() => rInfo(info._id)}
          className="text-white hover:text-black transition"
        >
          Delete
        </a>
      </div>
    </li>
  );
};

export default InfoModifyTab;
