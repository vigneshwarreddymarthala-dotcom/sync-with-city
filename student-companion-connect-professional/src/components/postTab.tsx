import Image from "next/image";
import { useRouter } from "next/navigation";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import { safeFormat } from "@/utils/date";

const PostTab = ({ event, link }: { event: REvent; link: string }) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expireEvent = (date: string, time: string) => {
    try {
      const today = new Date();
      const parsed = new Date(date + " " + time);
      if (isNaN(parsed.getTime())) return false;
      return isBefore(parsed, today);
    } catch {
      return false;
    }
  };

  const viewEvents = () => {
    let resolvedLink = link;
    if (resolvedLink.includes("/undefined/")) {
      const fallbackId = event.rId || (event as any).userId || (event as any).usrId || event._id || "hub-1";
      resolvedLink = resolvedLink.replace("/undefined/", `/${fallbackId}/`);
    }
    router.push(resolvedLink);
  };

  return (
    <li
      onClick={() => viewEvents()}
      className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-4 flex-1 px-4 md:px-6 pt-5 ">
        {event.eventImg && (
          <Image
            src={getImgPath(event.eventImg)}
            alt=""
            width={200}
            height={200}
            className="size-24 md:size-32 object-cover object-center rounded-md"
          />
        )}
        <div>
          <h3 className="font-semibold text-lg leading-none text-black mb-2">
            <strong className="font-medium text-orange text-xs uppercase">
              {event.type} Name
            </strong>
            <br />
            {event.eventName}
          </h3>
          <h4 className="text-xs font-medium text-darkGray flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
            <span className="flex items-center gap-1">
              <svg
                enableBackground="new 0 0 64 64"
                version="1.1"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-orange"
              >
                <g id="Glyph">
                  <path d="M52.708,20.849C52.708,8.185,44.584,0,32,0S11.292,8.185,11.292,20.849c0,10.556,16.311,31.747,18.175,34.118l2.278,2.928   c-9.542,0.025-17.237,1.38-17.237,3.051c0,1.686,7.836,3.053,17.502,3.053s17.502-1.367,17.502-3.053   c0-1.672-7.704-3.028-17.255-3.051l2.292-2.928C36.396,52.581,52.708,31.39,52.708,20.849z M25.294,20.835   c0-3.604,3.002-6.526,6.706-6.526c3.704,0,6.706,2.922,6.706,6.526S35.704,27.361,32,27.361   C28.296,27.361,25.294,24.439,25.294,20.835z" />
                </g>
              </svg>
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="485.213px"
                height="485.212px"
                viewBox="0 0 485.213 485.212"
                enableBackground="new 0 0 485.213 485.212"
                className="w-4 h-4 fill-orange"
              >
                <g>
                  <path
                    d="M60.652,75.816V15.163C60.652,6.781,67.433,0,75.817,0c8.38,0,15.161,6.781,15.161,15.163v60.653
		c0,8.38-6.781,15.161-15.161,15.161C67.433,90.978,60.652,84.196,60.652,75.816z M318.424,90.978
		c8.378,0,15.163-6.781,15.163-15.161V15.163C333.587,6.781,326.802,0,318.424,0c-8.382,0-15.168,6.781-15.168,15.163v60.653
		C303.256,84.196,310.042,90.978,318.424,90.978z M485.212,363.906c0,66.996-54.312,121.307-121.303,121.307
		c-66.986,0-121.302-54.311-121.302-121.307c0-66.986,54.315-121.3,121.302-121.3C430.9,242.606,485.212,296.919,485.212,363.906z
		 M454.89,363.906c0-50.161-40.81-90.976-90.98-90.976c-50.166,0-90.976,40.814-90.976,90.976c0,50.171,40.81,90.98,90.976,90.98
		C414.08,454.886,454.89,414.077,454.89,363.906z M121.305,181.955H60.652v60.651h60.653V181.955z M60.652,333.584h60.653V272.93
		H60.652V333.584z M151.629,242.606h60.654v-60.651h-60.654V242.606z M151.629,333.584h60.654V272.93h-60.654V333.584z
		 M30.328,360.891V151.628h333.582v60.653h30.327V94c0-18.421-14.692-33.349-32.843-33.349h-12.647v15.166
		c0,16.701-13.596,30.325-30.322,30.325c-16.731,0-30.326-13.624-30.326-30.325V60.651H106.14v15.166
		c0,16.701-13.593,30.325-30.322,30.325c-16.733,0-30.327-13.624-30.327-30.325V60.651H32.859C14.707,60.651,0.001,75.579,0.001,94
		v266.892c0,18.36,14.706,33.346,32.858,33.346h179.424v-30.331H32.859C31.485,363.906,30.328,362.487,30.328,360.891z
		 M303.256,242.606v-60.651h-60.648v60.651H303.256z M409.399,363.906h-45.49v-45.49c0-8.377-6.781-15.158-15.163-15.158
		s-15.159,6.781-15.159,15.158v60.658c0,8.378,6.777,15.163,15.159,15.163h60.653c8.382,0,15.163-6.785,15.163-15.163
		C424.562,370.692,417.781,363.906,409.399,363.906z"
                  />
                </g>
              </svg>
              {safeFormat(event.date, "EEE, do MMM")} | {event.time}
            </span>
          </h4>
          {event.type != "announcement" && (
            <>
              <h4 className="text-sm font-medium text-black mb-1">
                Duration:{" "}
                <span className="text-orange font-semibold">
                  {event.duration}
                </span>
              </h4>

              {parseInt(event.seats) - parseInt(event.bookedSeats) > 0 && (
                <>
                  <h4 className="text-sm font-medium text-black mb-1">
                    Available Seats:{" "}
                    <span className="text-sm font-semibold text-orange">
                      {parseInt(event.seats) - parseInt(event.bookedSeats)}
                      {parseInt(event.seats) - parseInt(event.bookedSeats) <
                        3 && <> HURRY!</>}
                    </span>
                  </h4>
                  <h4 className="text-sm text-orange font-semibold flex gap-1 items-center justify-end">
                    {parseInt(event.bookedSeats) > 1 && (
                      <>
                        <svg
                          width="85"
                          height="113"
                          viewBox="0 0 85 113"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                        >
                          <path
                            d="M85 72.7791C85 94.9907 65.9635 113 42.5 113C19.0365 113 0 94.9907 0 72.7791C0 49.0668 27.9438 13.3129 38.5156 0.653336C38.7387 0.345018 39.0556 0.116719 39.4192 0.00238955C39.7829 -0.11194 40.1738 -0.106192 40.5339 0.0187765C40.894 0.143745 41.204 0.381261 41.4179 0.696002C41.6317 1.01074 41.738 1.3859 41.7208 1.76568C40.8177 12.3594 41.4375 35.0301 60.4563 46.3301C60.8367 46.5871 61.3025 46.6867 61.7553 46.6076C62.208 46.5285 62.6121 46.277 62.8823 45.9063C65.266 42.405 66.6438 38.3202 66.8667 34.0943C66.8874 33.7061 67.036 33.3357 67.2894 33.0403C67.5429 32.745 67.887 32.5413 68.2683 32.4608C68.6497 32.3803 69.0471 32.4276 69.3988 32.5952C69.7505 32.7629 70.0369 33.0415 70.2135 33.388C78.3063 46.6655 85 61.1613 85 72.7791Z"
                            fill="#FF7F00"
                          />
                          <path
                            d="M15.9375 87.8576C15.9375 101.753 27.8375 113 42.5 113C57.1625 113 69.0625 101.753 69.0625 87.8576C69.0625 73.9621 53.674 53.4102 46.325 44.4055C46.1048 44.0889 45.7868 43.8527 45.4195 43.7331C45.0521 43.6135 44.6556 43.617 44.2904 43.743C43.9253 43.869 43.6115 44.1107 43.3969 44.4312C43.1823 44.7516 43.0788 45.1333 43.1021 45.5179C43.3677 52.5804 42.1281 64.5337 31.8573 71.0312C31.6578 71.1629 31.4335 71.2529 31.1982 71.2958C30.9628 71.3387 30.7211 71.3336 30.4877 71.2808C30.2544 71.228 30.0342 71.1286 29.8404 70.9886C29.6466 70.8486 29.4834 70.6708 29.3604 70.4662C28.4678 68.942 27.8673 67.2656 27.5896 65.5224C27.5492 65.1388 27.3839 64.7789 27.119 64.4977C26.854 64.2166 26.5041 64.0297 26.1225 63.9657C25.741 63.9016 25.349 63.9639 25.0063 64.143C24.6636 64.3221 24.3892 64.6081 24.225 64.9574C19.5677 72.7791 15.9375 81.0952 15.9375 87.8576Z"
                            fill="#FFDA00"
                          />
                          <path
                            d="M57.1094 99.1752C57.0705 101.042 56.6606 102.884 55.9034 104.592C55.1462 106.3 54.0568 107.842 52.6981 109.127C51.3395 110.413 49.7386 111.417 47.9881 112.082C46.2376 112.747 44.3722 113.059 42.5 113C40.6278 113.059 38.7624 112.747 37.0119 112.082C35.2614 111.417 33.6605 110.413 32.3019 109.127C30.9432 107.842 29.8538 106.3 29.0966 104.592C28.3394 102.884 27.9295 101.042 27.8906 99.1752C27.8906 92.3423 34.6198 82.6313 38.9583 77.0873C39.1701 76.7838 39.4721 76.5542 39.8218 76.431C40.1714 76.3078 40.551 76.2971 40.907 76.4005C41.2631 76.5039 41.5776 76.7161 41.8062 77.0072C42.0348 77.2983 42.166 77.6536 42.1812 78.023C42.188 80.1736 42.6672 82.2965 43.585 84.2426C44.5028 86.1887 45.837 87.9108 47.4937 89.2877C47.7102 89.4736 47.9686 89.6044 48.2468 89.6691C48.5249 89.7338 48.8147 89.7305 49.0913 89.6594C49.3679 89.5883 49.6231 89.4515 49.8352 89.2607C50.0473 89.07 50.21 88.8309 50.3094 88.5638C50.4151 88.2313 50.6173 87.9374 50.8905 87.7193C51.1636 87.5012 51.4954 87.3687 51.844 87.3385C52.1926 87.3082 52.5424 87.3817 52.8491 87.5495C53.1559 87.7173 53.406 87.9719 53.5677 88.2813C55.5831 91.5881 56.7958 95.3185 57.1094 99.1752Z"
                            fill="white"
                          />
                        </svg>
                        {event.bookedSeats} People are Coming
                      </>
                    )}
                  </h4>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {event.type != "announcement" && (
        <div className="text-lg py-1 font-medium text-white bg-orange text-center mt-2 rounded-b-md">
          {parseInt(event.seats) > parseInt(event.bookedSeats) &&
            !expireEvent(event.date, event.time) && (
              <span className="uppercase">
                {(!event.price || event.price != "0") && (
                  <>
                    {isNaN(Number(event.price)) ? "" : `€`}
                    {event.price}
                  </>
                )}
              </span>
            )}

          {(parseInt(event.seats) < parseInt(event.bookedSeats) ||
            parseInt(event.seats) - parseInt(event.bookedSeats) == 0) && (
            <span>SOLD OUT</span>
          )}
          {expireEvent(event.date, event.time) && <span>Expired</span>}
        </div>
      )}
    </li>
  );
};

export default PostTab;
