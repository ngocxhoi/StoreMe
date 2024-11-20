<template>
  <Transition name="toast">
    <div
      v-if="showToast"
      class="absolute bottom-10 w-[340px] right-6 bg-white dark:bg-gray-900 p-4 shadow-md dark:shadow-gray-500 rounded-xl"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <UButton
            :icon="icon"
            size="xl"
            variant="outline"
            color="black"
            class="rounded-full"
          />
          <div class="space-y-1">
            <h1 class="text-base font-semibold">
              {{ uploadState }} {{ totalFile }} file(s)
            </h1>
            <p class="text-xs">{{ name }}</p>
            <div class="loader"></div>
          </div>
        </div>
        <Icon
          name="i-heroicons-x-mark-solid"
          size="20"
          class="cursor-pointer"
          @click="emit('handleCloseToast')"
        />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  icon: string;
  uploadState: string;
  totalFile: number;
  showToast: boolean;
}>();

const emit = defineEmits(["handleCloseToast"]);
</script>

<style scoped>
.loader {
  width: 100%;
  height: 4px;
  background-color: #f3f3f3;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}
.loader::before {
  position: relative;
  content: "";
  display: block;
  width: 30%;
  height: 100%;
  border-radius: 4px;
  background-color: #3498db;
  animation: loading 2s linear infinite;
}
@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
