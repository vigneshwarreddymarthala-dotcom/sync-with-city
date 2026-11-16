import { News } from "@/models/news.model";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NewsTab = ({ news }: { news: News }) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const viewNews = (id: string) => {
    router.push(`/news/${id}`);
  };

  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition px-4 md:px-5 py-5 rounded-md my-3">
      {news.newsImg && (
        <Image
          src={getImgPath(news.newsImg)}
          alt=""
          width={400}
          height={400}
          onClick={() => viewNews(news._id)}
          className="w-full h-auto max-h-64 object-cover object-center rounded-md cursor-pointer"
        />
      )}
      <div className="mt-3">
        <h3 className="font-semibold text-xl text-orange leading-none">
          {news.newsTitle}
        </h3>
        <div
          className="blogInfo mb-3"
          dangerouslySetInnerHTML={{ __html: news.description }}
        ></div>
        {news.link && (
          <a
            href={news.link}
            className="bg-orange text-white py-1 px-4 cursor-pointer rounded-3xl"
            target="_blank"
          >
            View Details
          </a>
        )}
      </div>
    </li>
  );
};

export default NewsTab;
