import { BzInfo } from "@/models/info.model";
import Image from "next/image";
import { useRouter } from "next/navigation";

const InfoTab = ({ info }: { info: BzInfo }) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const viewNews = (id: string) => {
    router.push(`/news/${id}`);
  };

  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition px-4 md:px-5 py-5 rounded-md my-3">
      {info.iImg && (
        <Image
          src={getImgPath(info.iImg)}
          alt=""
          width={400}
          height={400}
          onClick={() => viewNews(info._id)}
          className="w-full h-auto max-h-64 object-cover object-center rounded-md cursor-pointer"
        />
      )}
      <div className="mt-3">
        <h3 className="font-semibold text-xl text-orange leading-none">
          {info.iTitle}
        </h3>
        <div
          className="blogInfo mb-3"
          dangerouslySetInnerHTML={{ __html: info.description }}
        ></div>
      </div>
    </li>
  );
};

export default InfoTab;
