<template>
  <div class="flex w-full items-center justify-between gap-4">
    <div class="flex items-center gap-4 max-w-full overflow-x-hidden">
      <PageThumbnail
        :type="fileProp.type"
        :url="fileProp.url"
        :name="fileProp.name"
        :extension="fileProp.extension"
      />
      <h3 class="truncate text-lg">
        {{ fileProp.name }}
      </h3>
    </div>
    <DropdownBtn :file-prop="fileProp" />
  </div>
</template>

<script lang="ts" setup>
import type { Document } from "@/composables/state";

const prop = defineProps<{ fileProp: Document }>();
const { fileProp } = toRefs(prop);
</script>
