<template>
  <div class="p-4 py-10 flex flex-1 flex-col items-center justify-between">
    <div class="flex flex-col w-full gap-4">
      <div
        class="rounded-xl w-full shadow-lg dark:shadow-gray-700 p-4 flex items-center justify-start gap-4"
      >
        <UAvatar
          :src="
            accountState?.avatar ??
            'https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png'
          "
        />
        <div>
          <p class="font-bold">{{ accountState?.fullName }}</p>
          <p class="text-gray-500 text-sm font-semibold">
            {{ accountState?.email }}
          </p>
        </div>
      </div>

      <div
        class="p-4 sm:hidden rounded-xl w-full shadow-lg dark:shadow-gray-700"
      >
        <UInput
          icon="i-heroicons-magnifying-glass"
          v-model="searchText"
          placeholder="Search"
          class="w-full"
          :ui="{ rounded: 'rounded-full shadow-lg dark:shadow-gray-700' }"
        />
      </div>

      <nav class="rounded-xl w-full shadow-lg dark:shadow-gray-700 py-4">
        <ul class="flex flex-1 flex-col p-4 gap-6">
          <NuxtLink
            :to="item.to"
            v-for="item in navItems"
            :key="item.title"
            class="flex items-center w-full gap-2 pl-20 py-2 rounded-full shadow-md"
            :class="
              route.path == item.to
                ? 'bg-red-500 text-white dark:text-black'
                : 'hover:bg-red-500/40'
            "
          >
            <Icon :name="item.icon" size="24" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </ul>
      </nav>

      <label
        for="fileUpload"
        @drop.prevent="handleDrop($event)"
        @dragover.prevent="isOver = true"
        @dragleave.prevent="isOver = false"
        class="group hover:bg-blue-300/50 rounded-xl cursor-pointer w-full min-h-40 border-2 border-black/50 dark:border-gray-100/50 border-dashed shadow-lg dark:shadow-gray-700 flex flex-col items-center justify-center py-4"
        :class="{ 'bg-blue-500/50': isOver }"
      >
        <h1
          class="text-lg font-semibold text-gray-500 group-hover:text-red-500"
        >
          Drag and drop to upload
        </h1>
        <p class="text-xs">Or</p>
        <h2>
          <span class="text-blue-400 underline font-semibold text-sm"
            >Click</span
          >
          to upload
        </h2>
      </label>
    </div>

    <div class="w-full space-y-4 p-4 rounded-xl shadow-lg dark:shadow-gray-700">
      <UButton
        label="Setting"
        icon="i-heroicons-cog-8-tooth-solid"
        size="xl"
        variant="outline"
        color="black"
        block
        class="rounded-full"
      />

      <UButton
        @click="handleLogout()"
        label="Logout"
        icon="i-heroicons-arrow-right-on-rectangle"
        color="red"
        size="xl"
        block
        class="rounded-full"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Document } from "~/composables/state";

const {
  accountState,
  isUploading,
  navItems,
  allDocuments,
  searchText,
  oldSearchText,
} = useStateGlobal();
const { uploadFile, getAllDocuments } = useDatabase();
const { logout } = useAuth();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const emits = defineEmits(["handleEmit", "handleToast", "handleSlideover"]);

const isOver = ref(false);
const uploadState = ref("");
const name = ref("");
const icon = ref("");
const totalFile = ref(0);

async function handleLogout() {
  await logout();
}

async function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (!files) {
    emits("handleSlideover", false);
    return;
  }

  emits("handleSlideover", false);

  const isValid = Array.from(files).every((file) => file.size < 10000000);
  if (!isValid) {
    toast.add({
      title: "Please chose a file must be less than 10MB",
      icon: "i-heroicons-exclamation-triangle",
      color: "red",
    });
    return;
  }

  try {
    isUploading.value = true;
    uploadState.value = "Uploading";
    icon.value = "i-heroicons-cloud-arrow-up";
    name.value = "Uploading...";
    emits("handleToast", true);
    totalFile.value = files.length;
    emits("handleEmit", {
      name: name.value,
      icon: icon.value,
      totalFile: totalFile.value,
      uploadState: uploadState.value,
    });
    const uploadPromise = Array.from(files).map((file) =>
      uploadFile(file, accountState.value.$id)
    );
    const results = await Promise.allSettled(uploadPromise);
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allDocuments.value?.documents.unshift(result.value as Document);
      } else {
        console.error(`Promise ${index + 1} rejected:`, result.reason);
      }
    });

    name.value = "Successfully uploaded";
    icon.value = "i-heroicons-check";
    uploadState.value = "Uploaded";
    emits("handleEmit", {
      name: name.value,
      icon: icon.value,
      totalFile: totalFile.value,
      uploadState: uploadState.value,
    });
    await sleep(3000);
  } catch (error: any) {
    throw showError(error);
  } finally {
    emits("handleToast", false);
    isUploading.value = false;
  }
}
</script>
