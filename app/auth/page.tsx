"use client";

import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { User } from "~/lib/schemas";

function AutoAuthFlow() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;
    try {
      jwtDecode(token) as User;
      localStorage.setItem("jwt", token);
    } catch {
      console.error("Invalid token");
    } finally {
      window.opener = null;
      window.open("about:blank", "_self");
      window.close();
    }
  }, [token]);

  return <div>page</div>;
}

export default function Page() {
  return (
    <Suspense>
      <AutoAuthFlow />
    </Suspense>
  );
}
