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
        offerLink={`/business/user/${params.usrId}/business`}
        photoLink={`/business/user/${params.usrId}/business/menus`}
        infoLink={`/business/user/${params.usrId}/business/info`}
        calenderLink={`/business/user/${params.usrId}/business/calender`}
        storeLink={`/business/user/${params.usrId}/business/store`}
      />
      {children}
    </>
  );
}
