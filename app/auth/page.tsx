"use client";

import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useSession } from "~/context/hooks";
import { User } from "~/lib/schemas";

function AutoAuthFlow() {
  const searchParams = useSearchParams();
  const { user, setUser } = useSession();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;
    try {
      const user = jwtDecode(token) as User;
      if (user?.email) {
        setUser(user);
      }
      localStorage.setItem("jwt", token);
    } catch {
      console.error("Invalid token");
    } finally {
      window.opener = null;
      window.open("about:blank", "_self");
      window.close();
    }
  }, [token, setUser]);

  return <div>page</div>;
}

export default function Page() {
  return (
    <Suspense>
      <AutoAuthFlow />
    </Suspense>
  );
}
