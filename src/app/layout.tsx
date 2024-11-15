import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "London Bus Route Finder",
  description: "Search for London bus routes around a given location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <div className="flex flex-col container mx-auto h-screen">
            <header className="py-5">
              <h1 className="text-3xl text-center">London Bus Route Finder</h1>
            </header>
            <main className="flex flex-grow flex-col p-5">{children}</main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
