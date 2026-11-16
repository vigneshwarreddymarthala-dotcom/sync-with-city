import BzProfileTab from "@/components/bzProfileTab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Companion Connect Booking",
  description: "Personal Companion Connect Booking",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { rId: string };
}) {
  return (
    <>
      <BzProfileTab
        rId={params.rId}
        offerLink={`/creators/${params.rId}/rabatt`}
        photoLink={`/creators/${params.rId}/menus`}
        infoLink={`/creators/${params.rId}/info`}
        calenderLink={`/creators/${params.rId}/calender`}
        storeLink={`/creators/${params.rId}/store`}
      />
      {children}
    </>
  );
}
