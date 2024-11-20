<template>
  <template v-if="typeState == 'detail'">
    <UModal v-model="openModal">
      <UCard>
        <template #header>
          <div
            v-if="filePropState"
            class="flex items-center justify-between gap-4 w-full"
          >
            <PageThumbnail
              :type="filePropState.type"
              :url="filePropState.url"
              :name="filePropState.name"
              :extension="filePropState.extension"
            />
            <div class="text-center space-y-1">
              <h3 class="font-semibold text-xl text-wrap w-full">
                {{ filePropState.name }}
              </h3>
              <p class="text-sm">
                {{ dateFormatted(filePropState.$createdAt) }}
              </p>
            </div>
            <UButton
              @click="openModal = false"
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="black"
            />
          </div>
        </template>
        <div>
          <UTable :rows="fileAttributes" />
        </div>
      </UCard>
    </UModal>
  </template>

  <template v-else-if="typeState == 'rename'">
    <UModal v-model="openModal">
      <UCard>
        <div class="space-y-6">
          <div
            class="text-center text-2xl font-semibold text-red-500 line-clamp-2"
          >
            Edit Name
          </div>
          <UInput v-model="newName" :autofocus="false" placeholder="New Name" />
          <div class="flex items-center justify-end gap-4">
            <UButton @click="openModal = false" label="Cancel" color="black" />
            <UButton
              :loading="isLoading"
              @click="handleEditName()"
              label="Rename"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </template>

  <template v-else-if="typeState == 'share'">
    <UModal v-model="openModal">
      <UCard>
        <template #header>
          <div
            v-if="filePropState"
            class="flex items-center justify-between gap-4"
          >
            <PageThumbnail
              :type="filePropState.type"
              :url="filePropState.url"
              :name="filePropState.name"
              :extension="filePropState.extension"
            />
            <div class="text-center space-y-1 max-w-80">
              <h3 class="font-semibold text-xl truncate">
                {{ filePropState.name }}
              </h3>
              <p class="text-sm">
                {{ dateFormatted(filePropState.$createdAt) }}
              </p>
            </div>
            <UButton
              @click="openModal = false"
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="black"
            />
          </div>
        </template>
        <div class="mb-5 space-y-2">
          <p class="text-center text-lg">Share this file with your friends</p>
          <UInput
            v-model="shareEmail"
            placeholder="Enter your friend's email"
            size="lg"
          />
        </div>
        <div class="flex items-center justify-end gap-4">
          <UButton @click="openModal = false" label="Cancel" color="black" />
          <UButton :loading="isLoading" @click="shareAction()" label="Share" />
        </div>
      </UCard>
    </UModal>
  </template>

  <template v-else-if="typeState == 'delete'">
    <UModal v-model="openModal">
      <UCard>
        <div class="space-y-6">
          <div
            class="text-center text-2xl font-semibold text-red-500 line-clamp-2"
          >
            Are you absolutely sure?
          </div>
          <p class="text-center line-clamp-3">
            This action cannot be undone. This will permanently delete the file
            and remove it from your servers.
          </p>
          <div class="flex items-center justify-end gap-4">
            <UButton @click="openModal = false" label="Cancel" color="black" />
            <UButton
              :loading="isLoading"
              @click="handleDeleteDocument()"
              label="Delete"
              color="red"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </template>
</template>

<script lang="ts" setup>
import type { Document } from "@/composables/state";
const { openModal, typeState, filePropState } = useStateGlobal();
const { renameFile, deleteFile, shareFile } = useDatabase();
const { errorToast } = useCreateToast();

const isLoading = ref(false);
const shareEmail = ref("");
const newName = ref("");

const fileAttributes = computed(() => {
  if (!filePropState.value) return [];

  return [
    {
      order: 1,
      name: "Type",
      value: filePropState.value.type,
    },
    {
      order: 2,
      name: "Format",
      value: filePropState.value.extension,
    },
    {
      order: 3,
      name: "Size",
      value: convertFileSize(filePropState.value.size),
    },
    {
      order: 4,
      name: "Updated At",
      value: dateFormatted(filePropState.value.$updatedAt),
    },
  ];
});

async function handleDeleteDocument() {
  try {
    isLoading.value = true;
    await deleteFile(filePropState.value.$id);
  } catch (error: any) {
    errorToast("Failed to delete file");
  } finally {
    openModal.value = false;
    isLoading.value = false;
  }
}

async function handleEditName() {
  try {
    if (newName.value == filePropState.value.name) throw new Error("Same name");
    isLoading.value = true;
    await renameFile(filePropState.value.$id, newName.value);
  } catch (error: any) {
    errorToast(error?.message || "Failed to rename file");
  } finally {
    openModal.value = false;
    isLoading.value = false;
    newName.value = "";
  }
}

const shareAction = async () => {
  try {
    isLoading.value = true;
    if (!filePropState.value) throw new Error("File not found");
    await shareFile(filePropState.value, shareEmail.value);
  } catch (error: any) {
    errorToast(error?.message || "Failed to share file");
  } finally {
    openModal.value = false;
    isLoading.value = false;
    shareEmail.value = "";
  }
};

onMounted(() => {
  const data = filePropState.value?.name;
  newName.value = data;
});
</script>
