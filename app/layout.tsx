import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "DAM Tour",
  description: "The official home of the DAM Tour. Est. 2006.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DAM Tour",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-green-900 text-green-300 text-center text-xs py-4">
          DAM Tour &copy; 2006
        </footer>
      </body>
    </html>
  );
}
