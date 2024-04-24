import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";
import StartupMap from "~/components/StartupMap";
import Account from "~/components/ui/account";
import SideMenu from "~/components/ui/side-menu";
import { validateRequest } from "~/lib/auth";
import { ContextProvider } from "~/lib/InteractiveMapContext";

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
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ContextProvider>
          <Toaster richColors />
          <SideMenu user={user} />
          <Account user={user} />
          {children}
          <StartupMap />
        </ContextProvider>
      </body>
    </html>
  );
}
