import type { Document } from "~/composables/state";

export const useDatabase = () => {
  const { database, storage, config, Query, ID } = useAppwrite();
  const { createUser, sendEmailOTP } = useAuth();
  const { uploadToStorage } = useFileStorage();
  const { errorToast, successToast } = useCreateToast();
  const { allDocuments } = useStateGlobal();

  // USERS COLLECTION
  async function getUserByEmail(email: string) {
    try {
      const doc = await database.listDocuments(
        config.public.appwriteDatabase,
        config.public.appwriteUserCollection,
        [Query.equal("email", email)]
      );
      return doc.total > 0 ? doc.documents[0] : null;
    } catch (error: any) {
      throw createError(error);
    }
  }

  async function createAccount(
    fullName: string,
    email: string,
    password: string
  ) {
    const accountExisting = await getUserByEmail(email);
    if (accountExisting) {
      throw new Error("This account has been created");
    }

    const userAccount = await createUser(email, password, fullName);

    const accountId = await sendEmailOTP(userAccount.$id, userAccount.email);

    try {
      const data = database.createDocument(
        config.public.appwriteDatabase,
        config.public.appwriteUserCollection,
        ID.unique(),
        {
          fullName,
          email,
          accountId,
        }
      );

      return data;
    } catch (error: any) {
      errorToast(error?.message);
      throw createError(error);
    }
  }

  // FILES COLLECTION
  async function getAllDocuments(userId: string, searchText?: string) {
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.equal("accountId", userId),
    ];
    if (searchText) queries.push(Query.contains("name", searchText));

    try {
      const docs = await database.listDocuments(
        config.public.appwriteDatabase,
        config.public.appwriteFilesCollection,
        queries
      );
      return docs;
    } catch (error: any) {
      throw createError(error);
    }
  }

  async function uploadFile(file: File, accountId: string, path?: string) {
    const fileExtension = file.name.split(".").pop();

    try {
      const fileUploaded = await uploadToStorage(file);

      const urlFile = `https://cloud.appwrite.io/v1/storage/buckets/${config.public.appwriteFileStore}/files/${fileUploaded.$id}/view?project=${config.public.appwriteProject}&project=${config.public.appwriteProject}`;
      const fileDocument = {
        name: fileUploaded.name,
        url: urlFile,
        type: databaseTypeFile(file.name),
        accountId,
        bucketField: fileUploaded.bucketId,
        extension: fileExtension,
        size: fileUploaded.sizeOriginal,
      };

      const data = await database
        .createDocument(
          config.public.appwriteDatabase,
          config.public.appwriteFilesCollection,
          ID.unique(),
          fileDocument
        )
        .catch(async (error: any) => {
          await storage.deleteFile(
            config.public.appwriteFileStore,
            fileUploaded.$id
          );
          throw error;
        });

      return data;
    } catch (error: any) {
      throw createError(error);
    }
  }

  async function renameFile(documentId: string, newName: string) {
    try {
      await database.updateDocument(
        config.public.appwriteDatabase,
        config.public.appwriteFilesCollection,
        documentId,
        {
          name: newName,
        }
      );
      const file = allDocuments.value.documents.find(
        (file) => file.$id == documentId
      );
      if (file) {
        file.name = newName;
        file.$updatedAt = new Date().toISOString();
      }
      successToast("File renamed successfully");
    } catch (error: any) {
      errorToast(error?.message || "Failed to rename file");
      throw createError(error);
    }
  }

  async function deleteFile(documentId: string) {
    try {
      await database.deleteDocument(
        config.public.appwriteDatabase,
        config.public.appwriteFilesCollection,
        documentId
      );
      allDocuments.value.documents = allDocuments.value.documents.filter(
        (file) => file.$id != documentId
      );
      allDocuments.value.total = allDocuments.value.total - 1;

      successToast("File deleted successfully");
    } catch (error: any) {
      errorToast(error?.message || "Failed to delete file");
      throw createError(error);
    }
  }

  async function shareFile(doc: Document, receiverEmail: string) {
    try {
      const receiver = await getUserByEmail(receiverEmail);
      if (!receiver) throw new Error("Receiver not found");

      const docShare = {
        name: doc.name,
        url: doc.url,
        type: doc.type,
        accountId: receiver.$id,
        bucketField: doc.bucketField,
        extension: doc.extension,
        size: doc.size,
      };
      const data = await database.createDocument(
        config.public.appwriteDatabase,
        config.public.appwriteFilesCollection,
        ID.unique(),
        docShare
      );
      successToast("File shared successfully");
      return data;
    } catch (error: any) {
      errorToast(error?.message);
    }
  }

  return {
    getUserByEmail,
    createAccount,
    getAllDocuments,
    uploadFile,
    renameFile,
    deleteFile,
    shareFile,
  };
};
