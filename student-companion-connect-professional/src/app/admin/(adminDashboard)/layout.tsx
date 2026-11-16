import AdmFooter from "@/components/admFooter";
import AdmHeader from "@/components/admHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Student Companion Connect",
  description: "Admin - Student Companion Connect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AdmHeader />
      <section className="container mx-auto flex justify-center">
        <div className="w-full max-w-xl my-5 px-2">{children}</div>
      </section>
      <AdmFooter />
    </main>
  );
}
