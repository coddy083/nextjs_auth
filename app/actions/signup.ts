"use server";

import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../lib/mongodb";

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
  }

  try {
    const adapter = MongoDBAdapter(clientPromise) as any;

    const existingUser = await adapter.getUserByEmail(email);
    if (existingUser) {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await adapter.createUser({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return { success: true, message: "회원가입이 완료되었습니다." };
    } else {
      throw new Error("사용자 등록에 실패했습니다.");
    }
  } catch (error) {
    return {
      success: false,
      message: "회원가입에 실패했습니다. 다시 시도해주세요.",
    };
  }
}
