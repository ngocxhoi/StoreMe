<template>
  <div class="mx-auto max-w-[2000px]">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import type { Documents } from "./composables/state";
useHead({
  titleTemplate: (titleChunk: string | undefined): any => {
    return titleChunk ? `${titleChunk} | ${appConfig.title}` : appConfig.title;
  },
});

const route = useRoute();
const appConfig = useAppConfig();
const { getCurrentUser } = useAuth();
const { accountState, allDocuments } = useStateGlobal();
const { getAllDocuments } = useDatabase();

async function initData() {
  if (route.path == "/auth") return;
  const searchText = (route.query.query as string) ?? undefined;
  try {
    const result1 = await getCurrentUser();
    accountState.value = result1;
    const result2 = await getAllDocuments(accountState.value.$id, searchText);
    allDocuments.value = result2 as Documents;
  } catch (error: any) {
    throw showError(error);
  }
}

onBeforeMount(async () => {
  await callOnce(async () => {
    await initData();
  });
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");

* {
  font-family: "Outfit", sans-serif;
  transition: all 0.3s ease;
}

body {
  @apply dark:bg-gray-800 max-h-screen;
}
</style>
