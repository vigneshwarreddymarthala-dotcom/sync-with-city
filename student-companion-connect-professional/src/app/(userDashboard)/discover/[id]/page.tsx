import { Discover } from "@/models/discover.model";
import Image from "next/image";
import { notFound } from "next/navigation";
import DiscoverCarousel from "@/components/discoverCarousel";

const getDiscover = async (id: string) => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_Discover_PATH}discover/${id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res: any = await fetch(endpoint, options);
    const rInfo: Discover = await res.json();
    if (res.status == 200) return rInfo;
    else return false;
  } catch (e) {
    return false;
  }
};

const DiscoverViewPg = async ({ params }: { params: { id: string } }) => {
  const data = await getDiscover(params.id);
  if (!data) notFound();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_Discover_PATH}uploads/${img}`;
  };

  return (
    <section className="container mx-auto flex justify-center">
      <div className="w-full max-w-lg my-5 px-2">
        {data.imgPath && data.imgPath.length == 1 && (
          <Image
            src={getImgPath(data.imgPath[0])}
            alt={data.dName}
            width={350}
            height={300}
            loading="lazy"
            itemProp="image"
            className="w-full h-auto"
          />
        )}
        {data.imgPath && data.imgPath.length > 1 && (
          <DiscoverCarousel disName={data.dName} hImages={data.imgPath} />
        )}
        <h1 className="text-orange font-medium text-4xl uppercase text-center">
          {data.dName}
        </h1>
        {data.link && (
          <div className="text-center mt-1">
            <a
              href={data.link}
              target="_blank"
              className="text-orange font-semibold text-lg underline hover:no-underline"
            >
              View Now
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscoverViewPg;
