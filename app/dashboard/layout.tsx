import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 z-10 flex h-screen w-full bg-white bg-opacity-95 p-6 pl-28 drop-shadow-xl">
      <div className="mr-2 flex w-56 flex-col gap-2 border-r-2 pr-2">
        Test dashboard sidebar (pwede ni gamitan ug .map()) - temporary styles
        <Link href="/dashboard" className="btn btn-primary">
          Home
        </Link>
        <Link href="/dashboard/analytics" className="btn btn-primary">
          Private analytics
        </Link>
      </div>
      {/* Content of dashboard pages here */}
      {children}
    </div>
  );
}
