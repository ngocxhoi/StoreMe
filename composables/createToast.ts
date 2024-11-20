export const useCreateToast = () => {
  const toast = useToast();

  function successToast(message: string) {
    toast.add({
      title: message,
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  }

  function errorToast(message: string) {
    toast.add({
      title: message,
      icon: "i-heroicons-exclamation-triangle",
      color: "red",
    });
  }

  return { successToast, errorToast };
};
