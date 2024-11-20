import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

export const useAppwrite = () => {
  const config = useRuntimeConfig();

  const client = new Client();
  client
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject);
  if (!client) useCookie("appwrite-session").value = undefined;

  const account = new Account(client);

  const database = new Databases(client);
  const storage = new Storage(client);

  return { config, account, database, storage, ID, Query };
};
