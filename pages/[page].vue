<template>
  <MainLayout>
    <div
      v-if="pageDocuments?.length > 0"
      class="w-full grid gap-4 2xl:gap-6 sm:grid-cols-2 2xl:grid-cols-3 pb-4"
    >
      <PageCard
        v-for="file in pageDocuments"
        :file-prop="file"
        :key="file.$id"
      />
    </div>

    <div
      v-else
      class="w-full h-full flex flex-grow items-start justify-center pt-10"
    >
      <h1 class="text-2xl font-semibold text-red-500">
        No {{ route.params.page }} found
      </h1>
    </div>

    <PageModal />
  </MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from "~/layouts/MainLayout.vue";

const route = useRoute();
const { allDocuments, sortAsc, totalSize } = useStateGlobal();

const pageDocuments = computed(() => {
  if (!allDocuments.value) return [];
  const allDocs = [...allDocuments.value.documents];

  const docs = allDocs.filter((file) => file.type == route.params.page);
  totalSize.value = docs?.reduce((acc, file) => acc + file.size, 0);
  return sortAsc.value ? docs : docs.reverse();
});
</script>
