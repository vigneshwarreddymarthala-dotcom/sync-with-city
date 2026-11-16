"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { showToast } from "./notify";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Creator } from "@/models/creator.model";

const BzProfileTab = ({
  rId,
  offerLink,
  photoLink,
  infoLink,
  calenderLink,
  storeLink,
}: {
  rId: string;
  offerLink: string;
  photoLink: string;
  infoLink: string;
  calenderLink: string;
  storeLink: string;
}) => {
  const [authToken, setAuthToken] = useState<any>("");
  const [rData, setRData] = useState<Creator>();
  const [showInfo, setShowInfo] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [showStr, setShowStr] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem("LogInSCCTkn")) {
      setAuthToken(localStorage.getItem("LogInSCCTkn"));
    }
  }, []);

  useEffect(() => {
    const getRData = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}creator/${rId}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const rInfo: Creator = await res.json();

        if (res.status == 200) {
          setRData(rInfo);

          const infEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/Information/${rInfo.rId}/0/12`;
          const infRes: any = await fetch(infEndpoint, options);
          const infInfo: any = await infRes.json();
          if (infRes.status == 200) {
            if (infInfo.data.length != 0) setShowInfo(true);
          }

          const calEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}bz-info/Year Events/${rInfo.rId}/0/12`;
          const calRes: any = await fetch(calEndpoint, options);
          const calInfo: any = await calRes.json();
          if (calRes.status == 200) {
            if (calInfo.data.length != 0) setShowCal(true);
          }

          const strEndpoint = `${process.env.NEXT_PUBLIC_API_PATH}store/${rInfo.rId}/0/12`;
          const strRes: any = await fetch(strEndpoint, options);
          const strInfo: any = await strRes.json();
          if (strRes.status == 200) {
            if (strInfo.data.length != 0) setShowStr(true);
          }
        }
      } catch (e) {
        showToast(e, "error");
      }
    };

    if (authToken && location) getRData();
  }, [authToken, rId]);

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    rData && (
      <>
        <aside className="flex items-center gap-8 mb-3">
          <Image
            src={getImgPath(rData.rLogo)}
            alt=""
            width={100}
            height={100}
            className="size-24 object-cover object-center rounded-full"
          />
          <div>
            <h3 className="font-semibold text-2xl leading-9">
              {rData.rName}
              <br />
              <small className="text-sm font-medium flex items-center gap-1">
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
                {rData.location}
              </small>
            </h3>
            {rData.description && (
              <p className="text-sm font-medium">{rData.description}</p>
            )}
            {rData.ownerName && (
              <p className="my-1 text-base font-medium flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-orange"
                >
                  <path d="M19.8099 10.8152C19.8819 10.8557 19.8963 10.9416 19.8992 10.9743L19.9 10.9874L19.8199 16.1519C19.8199 18.212 18.2237 19.892 16.2138 19.995L16.018 20H3.97199C1.93659 20 0.276779 18.3844 0.175028 16.3501L0.170085 16.1519L0.10005 10.9874C0.10005 10.9874 0.10005 10.8659 0.190095 10.8152C0.270135 10.7646 0.370185 10.8254 0.38019 10.8355C2.4012 12.1924 4.83242 13.0937 7.38369 13.4684C7.74387 13.519 8.10405 13.2861 8.2041 12.9216C8.41046 12.1431 9.04769 11.6138 9.82726 11.5507L9.98499 11.5443H10.015C10.8654 11.5443 11.5758 12.0912 11.7959 12.9216C11.8959 13.2861 12.2561 13.519 12.6163 13.4684C15.1676 13.0937 17.5988 12.1924 19.6198 10.8355C19.6198 10.8355 19.6398 10.8254 19.6598 10.8152C19.6999 10.795 19.7599 10.7849 19.8099 10.8152ZM9.995 12.9924C9.61898 12.9924 9.3018 13.2818 9.25155 13.6498L9.24462 13.7519V15.0583C9.24462 15.4836 9.58479 15.8177 9.995 15.8177C10.3802 15.8177 10.6897 15.5369 10.7386 15.1625L10.7454 15.0583V13.7519C10.7454 13.3367 10.4152 12.9924 9.995 12.9924ZM11.2856 0C12.7864 0 14.017 1.1443 14.2071 2.61264H16.1881C18.2891 2.61264 20 4.34428 20 6.47085C20 6.47085 19.94 7.3711 19.92 8.62477C19.918 8.72401 19.8699 8.82122 19.7909 8.87996C19.3097 9.2354 18.8694 9.52907 18.8294 9.54932C17.1686 10.6632 15.2386 11.447 13.1826 11.8369C13.0485 11.8632 12.9165 11.7934 12.8484 11.6739C12.2721 10.6754 11.1956 10.0253 9.995 10.0253C8.8024 10.0253 7.71586 10.6683 7.12256 11.6678C7.05353 11.7853 6.92346 11.8531 6.7904 11.8278C4.75138 11.4369 2.82141 10.6541 1.17059 9.55945L0.210105 8.89109C0.130065 8.84046 0.08004 8.74932 0.08004 8.64806C0.050025 8.1316 0 6.47085 0 6.47085C0 4.34428 1.71086 2.61264 3.81191 2.61264H5.78289C5.97299 1.1443 7.2036 0 8.70435 0H11.2856ZM11.2856 1.51898H8.70435C8.03402 1.51898 7.46373 1.9848 7.30365 2.61264H12.6863C12.5263 1.9848 11.956 1.51898 11.2856 1.51898Z" />
                </svg>
                {rData.ownerName}
              </p>
            )}

            <div className="mt-3 flex gap-3 items-center">
              {rData.facebook && (
                <a href={rData.facebook} target="_blank">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                  >
                    <g clipPath="url(#clip0_31_216)">
                      <path
                        d="M35 17.5C35 7.83508 27.1649 0 17.5 0C7.83508 0 0 7.83494 0 17.5C0 26.2347 6.39953 33.4746 14.7656 34.7874V22.5586H10.3223V17.5H14.7656V13.6445C14.7656 9.25859 17.3783 6.83594 21.3756 6.83594C23.2903 6.83594 25.293 7.17774 25.293 7.17774V11.4844H23.0863C20.9122 11.4844 20.2344 12.8334 20.2344 14.2174V17.5H25.0879L24.312 22.5586H20.2344V34.7874C28.6005 33.4746 35 26.2348 35 17.5Z"
                        fill="#1877F2"
                      />
                      <path
                        d="M24.312 22.5586L25.0879 17.5H20.2344V14.2174C20.2344 12.8332 20.9124 11.4844 23.0863 11.4844H25.293V7.17773C25.293 7.17773 23.2903 6.83594 21.3756 6.83594C17.3783 6.83594 14.7656 9.25859 14.7656 13.6445V17.5H10.3223V22.5586H14.7656V34.7874C15.6702 34.9292 16.5844 35.0002 17.5 35C18.4156 35.0003 19.3298 34.9292 20.2344 34.7874V22.5586H24.312Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_31_216">
                        <rect width="35" height="35" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              )}
              {rData.twitter && (
                <a href={rData.twitter}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 963.66 963.66"
                    className="w-7 h-7"
                  >
                    <circle
                      cx="481.83"
                      cy="481.83"
                      r="481.33"
                      stroke="#fff"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M185.33,203,415.4,510.58,183.88,760.69H236l202.7-219,163.77,219H779.78l-243-324.92L752.26,203H700.15L513.48,404.63,362.65,203ZM262,241.34h81.46l359.72,481H621.68Z"
                      fill="#fff"
                    />
                  </svg>
                </a>
              )}
              {rData.instagram && (
                <a href={rData.instagram} target="_blank">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                  >
                    <g clipPath="url(#clip0_31_215)">
                      <path
                        d="M26.7969 0H8.20312C3.67266 0 0 3.67266 0 8.20312V26.7969C0 31.3273 3.67266 35 8.20312 35H26.7969C31.3273 35 35 31.3273 35 26.7969V8.20312C35 3.67266 31.3273 0 26.7969 0Z"
                        fill="url(#paint0_radial_31_215)"
                      />
                      <path
                        d="M26.7969 0H8.20312C3.67266 0 0 3.67266 0 8.20312V26.7969C0 31.3273 3.67266 35 8.20312 35H26.7969C31.3273 35 35 31.3273 35 26.7969V8.20312C35 3.67266 31.3273 0 26.7969 0Z"
                        fill="url(#paint1_radial_31_215)"
                      />
                      <path
                        d="M17.5012 3.82812C13.7882 3.82812 13.3221 3.84439 11.8639 3.9107C10.4084 3.97742 9.41486 4.20779 8.54561 4.5459C7.64627 4.89508 6.88352 5.36225 6.12363 6.1224C5.36307 6.88242 4.8959 7.64518 4.54563 8.5441C4.20656 9.41363 3.97592 10.4076 3.91043 11.8624C3.84521 13.3208 3.82812 13.787 3.82812 17.5001C3.82812 21.2133 3.84453 21.6779 3.9107 23.1361C3.9777 24.5916 4.20807 25.5851 4.5459 26.4544C4.89535 27.3537 5.36252 28.1165 6.12268 28.8764C6.88242 29.6369 7.64518 30.1052 8.54383 30.4544C9.41377 30.7925 10.4074 31.0229 11.8627 31.0896C13.3211 31.1559 13.7867 31.1721 17.4996 31.1721C21.213 31.1721 21.6776 31.1559 23.1358 31.0896C24.5913 31.0229 25.586 30.7925 26.4559 30.4544C27.3548 30.1052 28.1165 29.6369 28.8761 28.8764C29.6367 28.1165 30.1037 27.3537 30.4541 26.4548C30.7902 25.5851 31.0209 24.5913 31.0893 23.1364C31.1548 21.6781 31.1719 21.2133 31.1719 17.5001C31.1719 13.787 31.1548 13.3211 31.0893 11.8627C31.0209 10.4072 30.7902 9.41377 30.4541 8.54451C30.1037 7.64518 29.6367 6.88242 28.8761 6.1224C28.1157 5.36197 27.3551 4.8948 26.4551 4.54604C25.5835 4.20779 24.5894 3.97729 23.1339 3.9107C21.6755 3.84439 21.2112 3.82812 17.497 3.82812H17.5012ZM16.2747 6.29193C16.6388 6.29139 17.045 6.29193 17.5012 6.29193C21.1518 6.29193 21.5843 6.30506 23.0259 6.37055C24.3589 6.43152 25.0824 6.65424 25.5644 6.84141C26.2024 7.08914 26.6573 7.38541 27.1355 7.86406C27.614 8.34258 27.9102 8.79826 28.1586 9.43633C28.3458 9.91758 28.5688 10.6411 28.6295 11.9741C28.6949 13.4154 28.7092 13.8482 28.7092 17.497C28.7092 21.1457 28.6949 21.5787 28.6295 23.0199C28.5685 24.3529 28.3458 25.0764 28.1586 25.5578C27.9109 26.1959 27.614 26.6502 27.1355 27.1284C26.657 27.6069 26.2027 27.9031 25.5644 28.1509C25.083 28.3389 24.3589 28.5611 23.0259 28.6221C21.5846 28.6876 21.1518 28.7018 17.5012 28.7018C13.8506 28.7018 13.4179 28.6876 11.9767 28.6221C10.6437 28.5605 9.92018 28.3378 9.43783 28.1507C8.7999 27.9028 8.34408 27.6067 7.86557 27.1281C7.38705 26.6496 7.09092 26.195 6.8425 25.5567C6.65533 25.0753 6.43234 24.3518 6.37164 23.0188C6.30615 21.5775 6.29303 21.1446 6.29303 17.4936C6.29303 13.8426 6.30615 13.412 6.37164 11.9707C6.43262 10.6377 6.65533 9.91416 6.8425 9.43223C7.09037 8.79416 7.38705 8.33848 7.8657 7.85996C8.34422 7.38145 8.7999 7.08518 9.43797 6.83689C9.9199 6.64891 10.6437 6.42674 11.9767 6.36549C13.2379 6.30848 13.7267 6.29139 16.2747 6.28852V6.29193ZM24.7993 8.56201C23.8935 8.56201 23.1587 9.29619 23.1587 10.2021C23.1587 11.1079 23.8935 11.8427 24.7993 11.8427C25.705 11.8427 26.4399 11.1079 26.4399 10.2021C26.4399 9.29633 25.705 8.56146 24.7993 8.56146V8.56201ZM17.5012 10.4789C13.6239 10.4789 10.4802 13.6227 10.4802 17.5001C10.4802 21.3776 13.6239 24.5198 17.5012 24.5198C21.3787 24.5198 24.5213 21.3776 24.5213 17.5001C24.5213 13.6228 21.3784 10.4789 17.501 10.4789H17.5012ZM17.5012 12.9428C20.0181 12.9428 22.0586 14.983 22.0586 17.5001C22.0586 20.017 20.0181 22.0575 17.5012 22.0575C14.9842 22.0575 12.944 20.017 12.944 17.5001C12.944 14.983 14.9842 12.9428 17.5012 12.9428Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <radialGradient
                        id="paint0_radial_31_215"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(9.29687 37.6957) rotate(-90) scale(34.6876 32.2622)"
                      >
                        <stop stopColor="#FFDD55" />
                        <stop offset="0.1" stopColor="#FFDD55" />
                        <stop offset="0.5" stopColor="#FF543E" />
                        <stop offset="1" stopColor="#C837AB" />
                      </radialGradient>
                      <radialGradient
                        id="paint1_radial_31_215"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(-5.86264 2.52123) rotate(78.681) scale(15.5055 63.9144)"
                      >
                        <stop stopColor="#3771C8" />
                        <stop offset="0.128" stopColor="#3771C8" />
                        <stop offset="1" stopColor="#6600FF" stopOpacity="0" />
                      </radialGradient>
                      <clipPath id="clip0_31_215">
                        <rect width="35" height="35" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </aside>
        <hr className="mt-5 border-gray" />
        <div className="flex flex-1 mb-5">
          {showInfo && (
            <Link
              href={infoLink}
              className={`w-1/2 text-center py-1 text-lg border-b-2 ${
                pathname === infoLink
                  ? "border-b-orange text-orange font-semibold"
                  : "border-b-lDGray"
              } `}
            >
              Info
            </Link>
          )}
          {showCal && (
            <Link
              href={calenderLink}
              className={`w-1/2 text-center py-1 text-lg border-b-2 ${
                pathname === calenderLink
                  ? "border-b-orange text-orange font-semibold"
                  : "border-b-lDGray"
              } `}
            >
              Calender
            </Link>
          )}
          <Link
            href={offerLink}
            className={`w-1/2 text-center py-1 text-lg border-b-2 ${
              pathname === offerLink
                ? "border-b-orange text-orange font-semibold"
                : "border-b-lDGray"
            } `}
          >
            Offers
          </Link>
          <Link
            href={photoLink}
            className={`w-1/2 text-center py-1 text-lg border-b-2 ${
              pathname === photoLink
                ? "border-b-orange text-orange font-semibold"
                : "border-b-lDGray"
            } `}
          >
            Photos
          </Link>
          {showStr && (
            <Link
              href={storeLink}
              className={`w-1/2 text-center py-1 text-lg border-b-2 ${
                pathname === storeLink
                  ? "border-b-orange text-orange font-semibold"
                  : "border-b-lDGray"
              } `}
            >
              Store
            </Link>
          )}
        </div>
      </>
    )
  );
};

export default BzProfileTab;
