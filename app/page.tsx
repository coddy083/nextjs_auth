import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SignOutButton, SignInButton } from "./auth-buttons";
import React from "react";
import styles from "./Home.module.css";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className={styles.container}>
      {session ? (
        <div className={styles.content}>
          <p className={styles.text}>
            로그인됨: {session.user?.name || session.user?.email}
          </p>
          {session.user?.image && (
            <img
              className={styles.profileImage}
              src={session.user.image}
              alt="Profile"
            />
          )}
          <SignOutButton className={styles.button} />
        </div>
      ) : (
        <div className={styles.content}>
          <p className={styles.text}>로그인되지 않음</p>
          <SignInButton className={styles.button} />
        </div>
      )}
    </main>
  );
}
