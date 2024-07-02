import clientPromise from "../../../lib/mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { MyCustomAdapter } from "../../../lib/adapter";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await validateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          console.log(
            "로그인 실패: 사용자를 찾을 수 없거나 비밀번호가 일치하지 않습니다."
          );
          return null;
        }

        console.log("로그인 성공:", user);
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          point: user.point || 0,
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // 사용자 찾기
      return true; // ✅ 로그인 성공
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (account && account.provider === "kakao") {
        token.picture = (profile as any).properties?.profile_image;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      console.log("JWT 콜백:", token);
      return token;
    },
    async session({ session, token, user }) {
      console.log("세션 콜백:", { session, token, user });
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
        } as any;
        session.accessToken = token.accessToken as string | undefined;
      }
      console.log("최종 세션:", session);
      return session;
    },
  },
  adapter: MyCustomAdapter(clientPromise) as any,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
};

async function validateUser(email: string, password: string) {
  const user = await findUser(email);

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return null;
  }

  return user;
}

async function findUser(email: string) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email });
  return user;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
