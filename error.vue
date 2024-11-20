<script setup lang="ts">
import type { NuxtError } from "#app";
const { logout } = useAuth();
const appConfig = useAppConfig();
useHead({
  title: `Error | ${appConfig.title}`,
});

defineProps({
  error: Object as () => NuxtError,
});

const session = useCookie("appwrite-session").value;

const handleError = () => clearError({ redirect: "/" });

async function handleLogout() {
  await logout();
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-full min-h-screen">
    <div class="text-center max-w-screen-md w-fit h-full space-y-4">
      <h1 class="text-2xl font-semibold">{{ error?.message }}</h1>
      <h2 class="text-lg">{{ error?.statusCode }}</h2>
      <UButton color="black" @click="handleError">Clear errors</UButton>
      <div v-if="session" class="w-full mx-auto text-center space-y-4">
        <UDivider label="Or" />
        <UButton label="Logout" @click="handleLogout()" color="red" />
      </div>
    </div>
  </div>
</template>
