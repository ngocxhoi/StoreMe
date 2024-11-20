import type { Documents } from "./state";

export const useAuth = () => {
  const { account, ID, database, config, Query } = useAppwrite();
  const { accountState, isOpenOTP, allDocuments } = useStateGlobal();
  const { errorToast } = useCreateToast();

  async function login(email: string, password: string) {
    try {
      const user = await useDatabase().getUserByEmail(email);
      if (!user) throw new Error("User not found");
      accountState.value = user;

      if (!accountState.value?.verification) {
        await sendEmailOTP(
          accountState.value.accountId,
          accountState.value.email
        );
        isOpenOTP.value = true;
        return;
      }

      const session = await account.createEmailPasswordSession(email, password);
      if (!session) {
        throw new Error("Failed to login");
      }

      useCookie("appwrite-session").value = session.$id;
      const allDocs = await useDatabase().getAllDocuments(user.$id);
      allDocuments.value = allDocs as Documents;
      navigateTo("/dashboard");
    } catch (error: any) {
      errorToast(error?.message);
    }
  }

  async function logout() {
    try {
      const sessionId = useCookie("appwrite-session").value;
      if (!sessionId) {
        throw new Error("Cannot found session id");
      }
      useCookie("appwrite-session").value = undefined;
      await account.deleteSession(sessionId);
    } catch (error: any) {
      errorToast(error?.message);
      throw createError(error);
    } finally {
      reloadNuxtApp();
    }
  }

  async function createUser(email: string, password: string, fullName: string) {
    try {
      const data = await account.create(ID.unique(), email, password, fullName);
      if (!data) {
        throw new Error("Failed to create an account");
      }

      const user = await database.listDocuments(
        config.public.appwriteDatabase,
        config.public.appwriteUserCollection,
        [Query.equal("accountId", data.$id)]
      );
      accountState.value = user.documents[0];

      return data;
    } catch (error: any) {
      errorToast(error?.message);
      throw createError(error);
    }
  }

  async function sendEmailOTP(userId: string, email: string) {
    try {
      const session = await account.createEmailToken(userId, email);
      if (!session) {
        throw new Error("Failed to create an account");
      }

      const { isOpenOTP } = useStateGlobal();
      isOpenOTP.value = true;

      return session.userId;
    } catch (error: any) {
      errorToast(error?.message);
      throw createError(error);
    }
  }

  async function verifySecret(userId: string, secret: string) {
    try {
      const session = await account.createSession(userId, secret);
      if (!session) {
        throw new Error("Failed to create session");
      }
      useCookie("appwrite-session").value = session.$id;

      await database.updateDocument(
        config.public.appwriteDatabase,
        config.public.appwriteUserCollection,
        accountState.value.$id,
        {
          verification: true,
        }
      );

      const allDocs = await useDatabase().getAllDocuments(
        accountState.value.$id
      );
      allDocuments.value = allDocs as Documents;

      return {
        sessionId: session.$id,
      };
    } catch (error: any) {
      errorToast(error?.message);
      throw createError(error);
    }
  }

  async function getCurrentUser() {
    const result = await account.get();
    if (!result) {
      useCookie("appwrite-session").value = undefined;
      return;
    }

    const user = await database.listDocuments(
      config.public.appwriteDatabase,
      config.public.appwriteUserCollection,
      [Query.equal("accountId", result.$id)]
    );

    return user.documents[0];
  }

  return {
    login,
    logout,
    createUser,
    sendEmailOTP,
    verifySecret,
    getCurrentUser,
  };
};
