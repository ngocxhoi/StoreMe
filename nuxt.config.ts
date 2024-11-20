// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  modules: ["@nuxt/ui", "@nuxt/image"],

  appConfig: {
    title: "StoreMe",
    description: "Your Data. Your way.",
  },

  runtimeConfig: {
    public: {
      appwriteSecret: process.env.APPWRITE_SECRET,
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
      appwriteProject: process.env.APPWRITE_PROJECT,
      appwriteDatabase: process.env.APPWRITE_DATABASE,
      appwriteUserCollection: process.env.APPWRITE_USERS_COLLECTION,
      appwriteFilesCollection: process.env.APPWRITE_FILES_COLLECTION,
      appwriteFileStore: process.env.APPWRITE_FILE_STORE,
    },
  },
});
