import StartupMap from "~/components/StartupMap";
import Account from "~/components/account";
import SideMenu from "~/components/side-menu";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen">
      <SideMenu />
      <Account />
      {children}
      <StartupMap />
    </main>
  );
}
