"use server";

import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

import { lucia, validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";
import { users, type User } from "~/lib/schema";
import { isValidEmail, type Expand } from "~/lib/utils";

export async function signup(newUser: Expand<Omit<User, "id"> & { password: string }>) {
  if (
    !newUser.email ||
    !newUser.firstName ||
    !newUser.lastName ||
    !newUser.location ||
    !newUser.password
  ) {
    return { error: "Missing fields." };
  }
  if (
    typeof newUser.email !== "string" ||
    newUser.email.length < 3 ||
    !isValidEmail(newUser.email)
  ) {
    return {
      error: "Invalid email",
    };
  }

  const password = newUser.password;
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return {
      error: "Invalid password",
    };
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

export async function login(email: string, password: string) {
  if (!email || !password) {
    return { error: "Missing fields." };
  }
  if (typeof email !== "string" || email.length < 3 || !isValidEmail(email)) {
    return { error: "Invalid email" };
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return { error: "Invalid password" };
  }

  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!existingUser) {
    return { error: "Invalid email or password" };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password
  );
  if (!validPassword) {
    return { error: "Invalid email or password" };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}
