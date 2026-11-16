import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Companion Connect Business Dashboard",
  description: "Student Companion Connect Business Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      <section className="container mx-auto flex justify-center">
        <div className="w-full max-w-xl my-5 px-2">{children}</div>
      </section>
      <Footer />
    </main>
  );
}
