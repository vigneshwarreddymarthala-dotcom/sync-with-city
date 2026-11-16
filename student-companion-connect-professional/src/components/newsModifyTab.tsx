import Link from "next/link";
import { News } from "@/models/news.model";
import { safeFormat } from "@/utils/date";

const NewsModifyTab = ({
  news,
  rNews,
}: {
  news: News;
  rNews: (id: string) => void;
}) => {
  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
      <div className="px-4 py-2">
        <h3 className="font-semibold text-xl text-orange ">{news.newsTitle}</h3>
        <h4 className="text-sm mt-1 font-semibold text-darkGray">
          Category: {news.category}
        </h4>
        <h4 className="text-sm mt-1 font-semibold text-darkGray">
          Location: {news.location}
        </h4>

        <h4 className="text-sm mt-1 font-semibold text-darkGray">
          Created On: {safeFormat(news.createdAt, "EEE, do MMM")}
        </h4>
      </div>
      <div className="text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
        <Link
          href={`/news/${news._id}/edit`}
          className="text-white hover:text-black transition"
        >
          Edit
        </Link>
        <Link
          href={`/news/${news._id}`}
          className="text-white hover:text-black transition"
        >
          View
        </Link>
        <a
          onClick={() => rNews(news._id)}
          className="text-white hover:text-black transition"
        >
          Delete
        </a>
        <a className="text-white hover:text-black transition">Share</a>
      </div>
    </li>
  );
};

export default NewsModifyTab;
