<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-start' }"
    class="[&>*]:transition-none"
  >
    <UButton
      color="black"
      variant="link"
      icon="i-heroicons-ellipsis-horizontal"
    />
    <template #delete="{ item }">
      <div class="flex items-center justify-between w-full gap-2 text-red-500">
        <div class="flex items-center gap-1.5">
          <Icon :name="item.icon" size="20" />
          <span class="font text-base">{{ item.label }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <div
            v-for="el in item.shortcuts"
            :key="el"
            class="flex gap-1 items-center border rounded p-1"
          >
            {{ el }}
          </div>
        </div>
      </div>
    </template>
  </UDropdown>
</template>

<script lang="ts" setup>
import type { Document } from "@/composables/state";
const { openModal, typeState, filePropState } = useStateGlobal();

const prop = defineProps<{ fileProp: Document }>();
const { fileProp } = toRefs(prop);

const items = [
  [
    {
      label: "Details",
      icon: "i-heroicons-information-circle-20-solid",
      click: () => {
        typeState.value = "detail";
        filePropState.value = fileProp.value;
        openModal.value = true;
      },
    },
  ],
  [
    {
      label: "Rename",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        typeState.value = "rename";
        filePropState.value = fileProp.value;
        openModal.value = true;
      },
    },
  ],
  [
    {
      label: "Share",
      icon: "i-heroicons-share",
      click: () => {
        typeState.value = "share";
        filePropState.value = fileProp.value;
        openModal.value = true;
      },
    },
  ],
  [
    {
      label: "Download",
      icon: "i-heroicons-arrow-down-tray",
      click: async () => {
        await downloadFile(fileProp.value.url);
      },
    },
  ],
  [
    {
      label: "Delete",
      slot: "delete",
      icon: "i-heroicons-trash-20-solid",
      shortcuts: ["⌘", "D"],
      click: () => {
        typeState.value = "delete";
        filePropState.value = fileProp.value;
        openModal.value = true;
      },
    },
  ],
];

async function downloadFile(url: string) {
  const downloadUrl = url.replace("/view?", "/download?");
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileProp.value.name;
  link.click();
  document.body.removeChild(link);
}
</script>
