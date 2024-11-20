import { ref, watch } from "vue";

export const useWatchDebounce = <T>(
  source: Ref<T>,
  callback: (newValue: T) => void,
  delay = 1000
) => {
  const { oldSearchText } = useStateGlobal();
  const timeout = ref<ReturnType<typeof setTimeout>>();

  watch(
    source,
    (newValue) => {
      if (timeout.value) clearTimeout(timeout.value);
      timeout.value = setTimeout(() => {
        callback(newValue);
      }, delay);
    },
    { immediate: true } // Optional: Trigger callback immediately on first change
  );
};
