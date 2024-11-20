<template>
  <section class="w-full pb-4">
    <h1 class="capitalize text-4xl font-semibold">{{ capitalize(title) }}</h1>
    <div class="flex items-end justify-between mt-2">
      <p>
        Total:
        <span class="font-semibold">{{ convertFileSize(totalSize) }}</span>
      </p>
      <div class="flex gap-4 items-center">
        <UButton
          @click="sortAsc = !sortAsc"
          color="black"
          label="Date"
          :trailing-icon="
            sortAsc
              ? 'i-heroicons-arrow-up-20-solid'
              : 'i-heroicons-arrow-down-20-solid'
          "
        />
        <UButton icon="i-heroicons-list-bullet" variant="outline" />
        <UButton
          icon="i-heroicons-squares-2x2-solid"
          color="red"
          variant="solid"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
}>();
const { title } = toRefs(props);
useSeoMeta({
  title: capitalize(title.value),
});

const { sortAsc, totalSize } = useStateGlobal();
</script>
