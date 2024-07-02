"use client";

import React from "react";
import { signIn } from "next-auth/react";
import styles from "./SignIn.module.css";

export default function SignIn() {
  const handleKakaoLogin = () => {
    signIn("kakao", { callbackUrl: "/" });
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.kakao}`}
          onClick={handleKakaoLogin}
        >
          카카오로 로그인
        </button>
        <button
          className={`${styles.button} ${styles.google}`}
          onClick={handleGoogleLogin}
        >
          구글로 로그인
        </button>
      </div>
    </div>
  );
}
