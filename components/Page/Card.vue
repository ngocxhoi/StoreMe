<template>
  <UCard class="shadow-md bg-gray-100 dark:bg-gray-800 dark:shadow-white">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <PageThumbnail
          :type="fileProp.type"
          :name="fileProp.name"
          :url="fileProp.url"
          :extension="fileProp.extension"
        />
        <div
          class="flex h-full flex-col items-end justify-between gap-1 line-clamp-1"
        >
          <DropdownBtn :file-prop="fileProp" />
          <p>{{ convertFileSize(fileProp.size) }}</p>
        </div>
      </div>
    </template>
    <div class="space-y-2">
      <p class="line-clamp-1 font-semibold">
        {{ fileProp.name }}
      </p>
      <p class="text-sm text-gray-500">
        {{ dateFormatted(fileProp.$createdAt) }}
      </p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Document } from "@/composables/state";

const prop = defineProps<{ fileProp: Document }>();
const { fileProp } = toRefs(prop);
</script>
