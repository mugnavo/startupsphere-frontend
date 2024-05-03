import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "~/lib/auth";

export async function POST() {
  const { session } = await validateRequest();
  if (!session) {
    return Response.json({ error: "No session found." }, { status: 401 });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}
