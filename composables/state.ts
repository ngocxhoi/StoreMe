export type Document = {
  name: string;
  url: string;
  type: string;
  accountId: string;
  bucketField: string;
  extension: string;
  size: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  owner: string | null;
  $databaseId: string;
  $collectionId: string;
};
export type Documents = {
  total: number;
  documents: Document[];
};

export const useStateGlobal = () => {
  const accountState = useState<any>("accountState");
  const isOpenOTP = useState<boolean>("isOpenOTP", () => false);
  const fileResult = useState<string | null>("fileResult");
  const isUploading = useState<boolean>("isUploading", () => false);
  const allDocuments = useState<Documents>("allDocuments");
  const sortAsc = useState<boolean>("sortAsc", () => true);
  const totalSize = useState<number>("totalSize", () => 0);
  const searchText = useState<string>("searchText", () => "");
  const oldSearchText = useState<string>("oldSearchText", () => "");

  const openModal = useState<boolean>("openModal", () => false);
  const typeState = useState<string>("type");
  const filePropState = useState<Document>("fileProp");

  const navItems = [
    {
      title: "Dashboard",
      icon: "i-heroicons-window-solid",
      to: "/dashboard",
    },
    {
      title: "Documents",
      icon: "i-heroicons-document-text-solid",
      to: "/document",
    },
    {
      title: "Images",
      icon: "i-heroicons-photo-solid",
      to: "/image",
    },
    {
      title: "Media",
      icon: "i-heroicons-video-camera-solid",
      to: "/media",
    },
    {
      title: "Others",
      icon: "i-heroicons-chart-pie-solid",
      to: "/other",
    },
  ];

  return {
    navItems,
    accountState,
    isOpenOTP,
    fileResult,
    isUploading,
    allDocuments,
    sortAsc,
    totalSize,
    searchText,
    oldSearchText,
    openModal,
    typeState,
    filePropState,
  };
};
