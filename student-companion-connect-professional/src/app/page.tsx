import Link from "next/link";
import Notify, { showToast } from "@/components/notify";
import Image from "next/image";
import syncLogo from "../../public/images/sync.png";

const HomePg = async () => {
  return (
    <>
      <Notify />
      <div className="bg-landingGradient">
        <main className="container mx-auto px-2 min-h-lvh flex items-center justify-center">
          <aside className="max-w-xl w-full p-6 md:p-12">
            <h1 className="flex justify-center">
              <Image
                src={syncLogo}
                alt="Poster"
                width="300"
                height="200"
                loading="lazy"
                itemProp="image"
                className="w-60 h-auto object-cover object-center"
              />
            </h1>
            {/* <div className="rounded-3xl">
              {posterList && posterList.length == 1 && (
                <Image
                  src={getImgPath(posterList[0].imgPath)}
                  alt="Poster"
                  width="640"
                  height="300"
                  loading="lazy"
                  itemProp="image"
                  className="w-full h-64 object-cover object-center rounded-3xl shadow-md shadow-lDGray"
                />
              )}
              {posterList && posterList.length > 1 && (
                <ItemCarousel hImages={posterList} />
              )}
            </div> */}
            <div className="flex justify-center items-center gap-24 mt-14 mb-40">
              {/* <Link
                href="/discover"
                className="flex flex-col justify-center items-center gap-1 text-white font-semibold text-xl"
              >
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="497.199px"
                  height="497.199px"
                  viewBox="0 0 497.199 497.199"
                  enableBackground="new 0 0 497.199 497.199"
                  className="w-10 h-10 fill-white"
                >
                  <g>
                    <g>
                      <path d="M275.4,275.4l-53.5-53.5c-26.8,26.8-68.8,122.401-68.8,122.401S248.6,302.1,275.4,275.4z" />
                      <path
                        d="M248.6,38.2C131.9,38.2,38.2,131.9,38.2,248.6c0,116.701,93.7,210.4,210.4,210.4C365.301,459,459,365.301,459,248.6
			C459,131.9,365.301,38.2,248.6,38.2z M288.801,288.801c-34.4,34.398-176,93.699-176,93.699s61.2-141.5,93.7-176
			c32.5-34.4,175.9-93.7,175.9-93.7S323.199,256.199,288.801,288.801z"
                      />
                      <path
                        d="M248.6,0C110.9,0,0,110.9,0,248.6c0,137.701,110.9,248.6,248.6,248.6c137.701,0,248.599-110.898,248.599-248.6
			C497.199,110.9,386.301,0,248.6,0z M248.6,478.1c-126.2,0-229.5-103.299-229.5-229.5c0-126.2,103.3-229.5,229.5-229.5
			c126.201,0,229.5,103.3,229.5,229.5C478.1,374.801,374.801,478.1,248.6,478.1z"
                      />
                    </g>
                  </g>
                </svg>
                Discover
              </Link> */}
              <Link
                href="/sign-in"
                className="flex flex-col justify-center items-center gap-1 text-xl rounded-full font-semibold text-white"
              >
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 fill-white"
                >
                  <path
                    clipRule="evenodd"
                    d="M4 2C2.34315 2 1 3.34315 1 5V15C1 16.6569 2.34315 18 4 18H6V21C6 21.3905 6.22734 21.7453 6.58214 21.9085C6.93694 22.0717 7.35428 22.0134 7.65079 21.7593L12.0366 18H20C21.6569 18 23 16.6569 23 15V5C23 3.34315 21.6569 2 20 2H4ZM5 5C4.44772 5 4 5.44772 4 6V14C4 14.5523 4.44772 15 5 15H12C12.5523 15 13 14.5523 13 14V6C13 5.44772 12.5523 5 12 5H5ZM14.5 7H19.5V5H14.5V7ZM19.5 15H14.5V13H19.5V15ZM14.5 11H19.5V9H14.5V11Z"
                    fillRule="evenodd"
                  />
                </svg>
                Post
              </Link>
              {/* <Link
                href="/entertainment"
                className="flex flex-col justify-center items-center gap-1 text-xl rounded-full font-semibold text-white"
              >
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 fill-white"
                >
                  <path
                    clipRule="evenodd"
                    d="M5.9741 4.11953C5.67024 3.95591 5.3035 3.96054 5.00386 4.13176L1.50386 6.13176C1.19229 6.3098 1 6.64114 1 7V14.5C1 14.8935 1.23078 15.2504 1.58964 15.4119L11.5896 19.9119C11.8506 20.0294 12.1494 20.0294 12.4104 19.9119L22.4104 15.4119C22.7692 15.2504 23 14.8935 23 14.5V7C23 6.64114 22.8077 6.3098 22.4961 6.13176L18.9961 4.13176C18.6965 3.96054 18.3298 3.95591 18.0259 4.11953L12 7.36424L5.9741 4.11953ZM6 12.5H4.5V10.5H6V9H8V10.5H9.5V12.5H8V14H6V12.5ZM17.5 14H15.5V12H17.5V14ZM17.5 11H19.5V9H17.5V11Z"
                    fillRule="evenodd"
                  />
                </svg>
                Activity
              </Link> */}

              {/* <div className="mt-56 flex gap-4">
              <Link
                href="/creator"
                className="block w-1/2 text-center py-1 border border-white text-xl rounded-full text-white font-medium transition hover:bg-white hover:text-orange"
              >
                Restaurant
              </Link>
              <Link
                href="/admin"
                className="block w-1/2 text-center py-1 border border-white text-xl rounded-full text-white font-medium transition hover:bg-white hover:text-orange"
              >
                Admin
              </Link>
            </div> */}
            </div>
            <div className="text-white text-xs font-medium text-center mt-12">
              Copyright &copy; 2024
              <br />
              Vigneshwar Reddy: Founder & CEO
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default HomePg;
