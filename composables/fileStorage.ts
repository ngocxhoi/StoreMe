export const useFileStorage = () => {
  const { storage, config, Query, ID } = useAppwrite();

  async function uploadToStorage(file: File) {
    const fileUploaded = await storage.createFile(
      config.public.appwriteFileStore,
      ID.unique(),
      file
    );

    return fileUploaded;
  }

  return { uploadToStorage };
};
