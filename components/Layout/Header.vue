<template>
  <div
    class="flex items-center justify-between gap-4 md:gap-10 px-10 py-4 md:py-10 rounded-2xl shadow-lg dark:shadow-gray-700"
  >
    <Logo size="size-14" class="md:hidden" />

    <div class="w-full hidden sm:block">
      <UInput
        icon="i-heroicons-magnifying-glass"
        placeholder="Search"
        v-model="searchText"
        size="xl"
        class="w-full"
        :ui="{ rounded: 'rounded-full shadow-lg dark:shadow-gray-700' }"
      />
    </div>
    <label
      for="fileUpload"
      class="hidden md:flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer shadow-md dark:shadow-gray-700 px-6 py-1"
    >
      <span class="text-nowrap select-none">File Uploader</span>
      <form>
        <UButton icon="i-heroicons-cloud-arrow-up" variant="link" size="lg" />
      </form>
    </label>

    <!-- Mobile -->
    <div class="flex md:hidden gap-4 items-center">
      <Theme />
      <div class="shadow dark:shadow-gray-700">
        <UButton
          @click="emit('openSlideover')"
          icon="i-heroicons-bars-3-bottom-right"
          size="md"
          variant="ghost"
          color="gray"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["openSlideover"]);
const router = useRouter();
const route = useRoute();
const { getAllDocuments } = useDatabase();
const { accountState, allDocuments, searchText, oldSearchText } =
  useStateGlobal();

async function handleSearch(val: string) {
  val = val.trim();

  if (val == oldSearchText.value) return;

  router.push({
    path: route.path,
    query: {
      query: val,
    },
  });

  if (!accountState.value.$id) return;

  const allDocs = await getAllDocuments(accountState.value.$id, val);
  allDocuments.value = allDocs as Documents;

  oldSearchText.value = val;
}

useWatchDebounce(searchText, (val) => handleSearch(val));
</script>
