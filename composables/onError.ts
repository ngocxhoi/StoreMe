import type { FormErrorEvent } from "#ui/types";

export const useOnError = (event: FormErrorEvent) => {
  const toast = useToast();
  const err = event.errors[0];
  toast.add({
    title: `Error at path: ${err.path}`,
    icon: "i-heroicons-x-mark",
    color: "red",
  });

  const element = document.getElementById(err.id);
  element?.focus();
};
