import { ObjectId, Timestamp } from "mongodb";
import { Adapter } from "next-auth/adapters";

export function MyCustomAdapter(clientPromise: any, options = {}): Adapter {
  return {
    async createUser(user) {
      const client = await clientPromise;
      const addDb = {
        point: 0,
        grade: 0,
        isActive: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userWithPoint = {
        ...user,
        ...addDb,
      };
      const result = await client
        .db()
        .collection("users")
        .insertOne(userWithPoint);

      // MongoDB의 insertOne 결과에서 삽입된 문서를 반환
      return { ...userWithPoint, id: result.insertedId.toString() };
    },

    // // 다른 필수 메서드들 구현
    async getUser(id) {
      const client = await clientPromise;
      const user = await client
        .db()
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },

    async getUserByEmail(email) {
      const client = await clientPromise;
      const user = await client.db().collection("users").findOne({ email });
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },

    async getUserByAccount(provider_providerAccountId) {
      const client = await clientPromise;
      const account = await client
        .db()
        .collection("accounts")
        .findOne(provider_providerAccountId);
      if (!account) return null;

      const user = await client
        .db()
        .collection("users")
        .findOne({ _id: new ObjectId(account.userId) });
      if (!user) return null;

      return { ...user, id: user._id.toString() };
    },

    async linkAccount(account) {
      const client = await clientPromise;
      const result = await client
        .db()
        .collection("accounts")
        .insertOne(account);

      return { ...account, id: result.insertedId.toString() };
    },
    // 기타 필요한 메서드들...
  };
}
