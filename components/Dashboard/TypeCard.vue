<template>
  <NuxtLink
    :to="`/${type}`"
    class="text-gray-800 dark:text-white select-none flex h-full flex-col justify-between text-center"
  >
    <div class="flex items-center justify-between gap-4">
      <div
        class="flex items-center justify-center size-14 text-white rounded-full"
        :class="color"
      >
        <Icon :name="icon" size="30" />
      </div>
      {{ size }}
    </div>
    <h3 class="capitalize text-2xl font-semibold">{{ type }}</h3>
    <span class="text-sm text-gray-500">{{ days }}</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Document } from "@/composables/state";
const prop = defineProps<{
  docs: Document[];
  type: string;
}>();

const { docs, type } = toRefs(prop);

const icon = computed(() => {
  if (type.value == "document") return "i-heroicons-document-text-solid";
  else if (type.value == "image") return "i-heroicons-photo-solid";
  else if (type.value == "media") return "i-heroicons-video-camera-solid";
  else return "i-heroicons-chart-pie-solid";
});

const color = computed(() => {
  if (type.value == "document") return "bg-blue-400";
  else if (type.value == "image") return "bg-green-400";
  else if (type.value == "media") return "bg-red-400";
  else return "bg-yellow-400";
});

const size = computed(() => {
  const size = docs.value.reduce((acc, file) => acc + file.size, 0);
  return convertFileSize(size);
});

const days = computed(() => {
  const time = docs.value[0].$createdAt;
  return dateFormatted(time);
});
</script>
