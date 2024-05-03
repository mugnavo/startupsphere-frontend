import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { Argon2id } from "oslo/password";

import { lucia } from "~/lib/auth";
import { db } from "~/lib/db";
import { users, type User } from "~/lib/schema";
import { isValidEmail, type Expand } from "~/lib/utils";

export async function POST(request: NextRequest) {
  const newUser = (await request.json()) as Expand<
    Omit<User, "id"> & { password: string }
  >;

  if (
    !newUser.email ||
    !newUser.firstName ||
    !newUser.lastName ||
    !newUser.location ||
    !newUser.password
  ) {
    return Response.json({ error: "Missing fields." }, { status: 400 });
  }
  if (
    typeof newUser.email !== "string" ||
    newUser.email.length < 3 ||
    !isValidEmail(newUser.email)
  ) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, newUser.email),
  });
  if (existingUser) {
    return Response.json({ error: "Email is already registered." }, { status: 400 });
  }

  const password = newUser.password;
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return Response.json({ error: "Invalid password." }, { status: 400 });
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  // TODO: more validation, and check if email already exists
  await db.insert(users).values({ ...newUser, hashedPassword, id: userId });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/");
}
