"use client";

import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AutoAuthFlow() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;
    try {
      const data = jwtDecode(token) as any;
      console.log(data);
      if (data?.userId) {
        localStorage.setItem("jwt", token);
      }
    } catch {
      console.error("Invalid token");
    } finally {
      window.opener = null;
      window.open("about:blank", "_self");
      window.close();
    }
  }, [token]);

  return <div>Logging in via SSO from InvestTrack...</div>;
}

export default function Page() {
  return (
    <Suspense>
      <AutoAuthFlow />
    </Suspense>
  );
}
