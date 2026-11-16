import UserFooter from "@/components/userFooter";
import UserHeader from "@/components/userHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Companion Connect Booking",
  description: "Personal Companion Connect Booking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <UserHeader />
      <section className="container mx-auto flex justify-center">
        <div className="w-full max-w-xl md:max-w-3xl lg:max-w-5xl my-4 sm:my-6 px-3 sm:px-6">{children}</div>
      </section>
      <UserFooter />
    </main>
  );
}
