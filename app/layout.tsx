import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import StartupMap from "~/components/StartupMap";
import Account from "~/components/account";
import SideMenu from "~/components/side-menu";
import { validateRequest } from "~/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartUpSphere",
  description: "3D Mapping for Startup Ecosystems",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SideMenu user={user} />
        <Account user={user} />
        {children}
        <StartupMap />
      </body>
    </html>
  );
}
