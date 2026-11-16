import FrdNavigation from "@/components/frdNavigation";
import FrdSearch from "@/components/frdSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Companion Connect Friend List",
  description: "Student Companion Connect Friend List",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FrdSearch />
      <FrdNavigation />
      {children}
    </>
  );
}
