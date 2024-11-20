<template>
  <MainLayout>
    <div class="grid xl:grid-cols-2 gap-10">
      <div class="w-full h-full text-white space-y-4">
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-4 aspect-[2.5/1] bg-red-400 p-4 rounded-2xl"
        >
          <div
            class="w-1/3 min-w-40 aspect-1 border-[1.5rem] border-white/50 rounded-full flex items-center justify-center"
          >
            <h2 class="text-3xl font-semibold">{{ progress }} %</h2>
            <div class="slice">
              <div class="bar"></div>
              <div class="fill"></div>
            </div>
          </div>

          <div class="space-y-2 text-center">
            <h1 class="text-3xl font-semibold">Available Storage</h1>
            <p class="text-lg opacity-90">
              {{ convertFileSize(totalSize) }} / 2GB
            </p>
          </div>
        </div>

        <div v-if="allDocs" class="grid grid-cols-2 gap-4">
          <div
            v-for="type in types"
            class="w-full min-h-40 rounded-2xl bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-500 p-4"
          >
            <DashboardTypeCard
              :type="type"
              :docs="allDocs.filter((doc) => doc.type == type)"
            />
          </div>
        </div>
      </div>

      <div class="border-2 bg-white dark:bg-gray-800 p-4 rounded-xl">
        <h1 class="text-3xl font-semibold">Recent files uploaded</h1>
        <div v-if="allDocs" class="space-y-5 mt-8">
          <div
            v-for="index in 5"
            :key="allDocs[index - 1].$id"
            class="hover:bg-gray-300 rounded-xl p-1 px-4 flex items-center shadow-lg dark:shadow-gray-700"
          >
            <DashboardRecentCard :file-prop="allDocs[index - 1]" />
          </div>
        </div>
      </div>
    </div>

    <PageModal />
  </MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from "~/layouts/MainLayout.vue";
useSeoMeta({
  title: "Dashboard",
});
const { allDocuments } = useStateGlobal();

const allDocs = computed(() => allDocuments.value?.documents);
const types = ["document", "image", "media", "other"];
const progress = ref("0");

const totalSize = computed(() => {
  const size = allDocs.value?.reduce((acc, file) => acc + file.size, 0);
  progress.value = (((size ?? 0) / (2 * 1024 * 1024 * 1024)) * 100).toFixed(2);
  return size ?? 0;
});
</script>
