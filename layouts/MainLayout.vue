<template>
  <main class="flex gap-4 w-full h-screen max-h-screen box-border p-4">
    <LayoutSidebar />

    <section class="flex flex-1 w-full h-full max-h-screen flex-col gap-4">
      <LayoutHeader @open-slideover="isOpen = true" />

      <div
        class="flex flex-grow flex-col gap-4 overflow-hidden max-h-full min-w-[400px] w-full bg-gray-200 dark:bg-gray-700 shadow-lg dark:shadow-gray-700 rounded-xl"
      >
        <div v-if="route.path != '/dashboard'" class="m-10 mb-0">
          <PageHeader :title="String(route.params.page)" />
        </div>
        <div
          class="m-10 mt-0 overflow-y-auto rounded-xl"
          :class="{ 'mt-10': route.path == '/dashboard' }"
        >
          <slot />
        </div>
      </div>
    </section>
    <!-- File Uploader -->
    <input
      ref="uploadInput"
      type="file"
      id="fileUpload"
      class="hidden"
      multiple
      @change="onChange"
    />
  </main>

  <!-- Notification -->
  <ToastThumbnail
    :name="name"
    :uploadState="uploadState"
    :totalFile="totalFile"
    :icon="icon"
    :show-toast="showToast"
  />

  <USlideover v-model="isOpen" side="left" class="max-w-sm right-0 md:hidden">
    <LayoutMobileNavigation
      @handle-toast="emitsOpenToast($event)"
      @handle-slideover="emitsOpenSlideover($event)"
      @handle-emit="changeState($event)"
    />
  </USlideover>
</template>

<script lang="ts" setup>
import type { Document } from "~/composables/state";
type emitState = {
  name: string;
  icon: string;
  uploadState: string;
  totalFile: number;
};

const toast = useToast();
const route = useRoute();
const { accountState, allDocuments, isUploading } = useStateGlobal();
const { uploadFile } = useDatabase();

const isOpen = ref(false);
const name = ref("");
const icon = ref("");
const uploadState = ref("");
const totalFile = ref(0);
const showToast = ref(false);

function emitsOpenToast(event: boolean) {
  showToast.value = event;
}
function emitsOpenSlideover(event: boolean) {
  isOpen.value = event;
}

async function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files) {
    isOpen.value = false;
    return;
  }

  isOpen.value = false;

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
    showToast.value = true;
    totalFile.value = files.length;

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
    await sleep(3000);
  } catch (error: any) {
    throw showError(error);
  } finally {
    showToast.value = false;
    isUploading.value = false;
  }
}

function changeState(event: emitState) {
  name.value = event.name;
  icon.value = event.icon;
  uploadState.value = event.uploadState;
  totalFile.value = event.totalFile;
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
}

/* Track of the scrollbar */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle of the scrollbar */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
