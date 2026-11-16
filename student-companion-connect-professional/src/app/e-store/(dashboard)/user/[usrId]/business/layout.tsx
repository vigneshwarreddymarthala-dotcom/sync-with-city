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
        offerLink={`/e-store/user/${params.usrId}/business`}
        photoLink={`/e-store/user/${params.usrId}/business/menus`}
        infoLink={`/e-store/user/${params.usrId}/business/info`}
        calenderLink={`/e-store/user/${params.usrId}/business/calender`}
        storeLink={`/e-store/user/${params.usrId}/business/store`}
      />
      {children}
    </>
  );
}
