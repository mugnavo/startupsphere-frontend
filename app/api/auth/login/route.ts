import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { Argon2id } from "oslo/password";
import { lucia } from "~/lib/auth";
import { db } from "~/lib/db";
import { users } from "~/lib/schema";
import { isValidEmail } from "~/lib/utils";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return Response.json({ error: "Missing fields." }, { status: 400 });
  }
  if (typeof email !== "string" || email.length < 3 || !isValidEmail(email)) {
    return Response.json({ error: "Invalid email or password" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return Response.json({ error: "Invalid password or password" }, { status: 400 });
  }

  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!existingUser) {
    return Response.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password
  );
  if (!validPassword) {
    return Response.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}
