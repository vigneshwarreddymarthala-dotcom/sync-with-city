import ProfileTab from "@/components/profileTab";
import type { Metadata } from "next";
import Link from "next/link";

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
      <ProfileTab rId={params.rId} />
      {children}
    </>
  );
}
