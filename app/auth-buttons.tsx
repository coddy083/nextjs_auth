"use client";

import React, { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={() => signOut().then(() => router.refresh())}
    >
      로그아웃
    </button>
  );
}

export function SignInButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={() => signIn().then(() => router.refresh())}
    >
      로그인
    </button>
  );
}
