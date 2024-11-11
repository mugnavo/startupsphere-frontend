import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import StartupMap from "~/components/StartupMap";
import Account from "~/components/ui/account";
import SideMenu from "~/components/ui/side-menu";
import { ContextProvider } from "~/context/Provider";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <SideMenu />
          <Account />
          {children}
          <StartupMap />
        </ContextProvider>
      </body>
    </html>
  );
}
