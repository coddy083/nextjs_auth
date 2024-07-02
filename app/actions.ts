"use server";

import { signIn, signOut } from "next-auth/react";

export async function handleSignIn(email: string, password: string) {
  return signIn("credentials", { redirect: false, email, password });
}

export async function handleSignOut() {
  return signOut();
}
