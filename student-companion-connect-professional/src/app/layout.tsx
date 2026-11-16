import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.scss";

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FF9900",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Personal Companion Connect",
  description: "Personal Companion Connect",
  manifest: "/manifest.json",
  applicationName: "Personal Companion Connect",
  appleWebApp: {
    title: "Personal Companion Connect",
    statusBarStyle: "black-translucent",
    startupImage: ["/studentCompanionConnect512.png"],
  },
  icons: {
    icon: "/studentCompanionConnect192.png",
    shortcut: "/studentCompanionConnect512.png",
    apple: "studentCompanionConnect512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
