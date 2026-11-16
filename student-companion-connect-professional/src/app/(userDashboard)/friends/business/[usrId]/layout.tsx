import BzProfileTab from "@/components/bzProfileTab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sync City Business",
  description: "Sync City Business",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { usrId: string };
}) {
  return (
    <>
      <BzProfileTab
        rId={params.usrId}
        offerLink={`/friends/business/${params.usrId}`}
        photoLink={`/friends/business/${params.usrId}/menus`}
        infoLink={`/friends/business/${params.usrId}/info`}
        calenderLink={`/friends/business/${params.usrId}/calender`}
        storeLink={`/friends/business/${params.usrId}/store`}
      />
      {children}
    </>
  );
}
