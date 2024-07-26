// tsx is an extension for typeScript....layout is a special nextJs file
import type { Metadata } from "next";
import { Inter,Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
//import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk=Space_Grotesk({
  subsets:['latin'],
  weight:['300','400','500','600','700']
})

// modify the SEO metadata
export const metadata: Metadata = {
  title: "pricetracker", // Name will get reflect in the tab
  description: 'Track product prices effortlessly and save money on your online shopping',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-10xl mx-auto">
        {/*  select and click ctrl+space to add header of components/navbar */}
          <Navbar /> 
        {children}
        </main>
        </body>
    </html>
  );
}
