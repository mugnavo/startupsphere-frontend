import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import StartupMap from "~/components/StartupMap";
import Account from "~/components/account";
import SideMenu from "~/components/side-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartUpSphere",
  description: "3D Mapping for Startup Ecosystems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SideMenu />
        <Account />
        {children}
        <StartupMap />
      </body>
    </html>
  );
}
