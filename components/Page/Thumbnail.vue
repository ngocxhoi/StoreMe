<template>
  <div>
    <UAvatar v-if="src" :src="src" size="xl" :alt="name" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type: string;
  name: string;
  url: string;
  extension: string;
}>();

const { type, name, url, extension } = toRefs(props);
const src = computed(() => {
  if (type.value == "image") {
    return url.value;
  } else if (type.value == "document") {
    return "/img/document.png";
  } else if (type.value == "media" && extension.value == "mp4") {
    return "/img/video.png";
  } else if (type.value == "media" && extension.value == "mp3") {
    return "/img/audio_file_icon.png";
  } else if (type.value == "other" && extension.value == "pdf") {
    return "/img/pdf.png";
  } else if (type.value == "other" && extension.value == "xlsx") {
    return "/img/excel.png";
  } else if (type.value == "other" && extension.value == "pptx") {
    return "/img/pptx.png";
  } else {
    return "/img/other-file-type.png";
  }
});
</script>
