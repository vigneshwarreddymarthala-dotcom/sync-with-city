import Image from "next/image";
import { useRouter } from "next/navigation";
import { REvent } from "@/models/event.model";
import { isBefore } from "date-fns";
import { safeFormat } from "@/utils/date";
import Link from "next/link";

const PostModifyTab = ({
  event,
  rEvent,
}: {
  event: REvent;
  rEvent: (id: string) => void;
}) => {
  const router = useRouter();

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const expireEvent = (date: string, time: string) => {
    const today = new Date();
    if (isBefore(date + " " + time, today)) return true;
    else return false;
  };

  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden">
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
            <strong className="text-xs font-medium bg-orange text-white px-2 rounded-md mb-0.5 inline-block uppercase">
              {event.type}
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
                <h4 className="text-sm font-medium text-black">
                  Available Seats:{" "}
                  <span className="text-sm font-semibold text-orange">
                    {parseInt(event.seats) - parseInt(event.bookedSeats)}
                    {parseInt(event.seats) - parseInt(event.bookedSeats) <
                      3 && <> HURRY!</>}
                  </span>
                </h4>
              )}
            </>
          )}
          <h4 className="flex gap-1 text-orange font-semibold text-sm">
            {event.type != "announcement" && (
              <>
                {(!event.price || event.price != "0") && (
                  <span>
                    {isNaN(Number(event.price)) ? "" : `€`}
                    {event.price}
                  </span>
                )}

                {(parseInt(event.seats) < parseInt(event.bookedSeats) ||
                  parseInt(event.seats) - parseInt(event.bookedSeats) == 0) && (
                  <span>SOLD OUT</span>
                )}
              </>
            )}
            {expireEvent(event.date, event.time) && <span>Expired</span>}
          </h4>
        </div>
      </div>
      <div className="text-base py-1 font-medium text-white bg-orange flex justify-center items-center gap-5 mt-2 rounded-b-md">
        <Link
          href={`/events/${event._id}/edit`}
          className="text-white hover:text-black transition"
        >
          Edit
        </Link>
        <Link
          href={`/events/${event._id}/views`}
          className="text-white hover:text-black transition"
        >
          View
        </Link>
        <a
          onClick={() => rEvent(event._id)}
          className="text-white hover:text-black transition"
        >
          Delete
        </a>
        <Link
          href={`/events/${event._id}/booking`}
          className="text-white hover:text-black transition"
        >
          Bookings
        </Link>
        <Link
          href={`/events/${event._id}/review`}
          className="text-white hover:text-black transition"
        >
          Reviews
        </Link>
      </div>
    </li>
  );
};

export default PostModifyTab;
