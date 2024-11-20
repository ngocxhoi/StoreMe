<template>
  <div
    class="w-full max-w-xl flex flex-col justify-center shadow-md rounded-xl bg-gray-100 dark:bg-gray-700 dark:shadow-white p-10"
  >
    <div class="flex items-center gap-4">
      <h1 class="text-2xl">Login with :</h1>
      <Icon name="logos:google-icon" size="24" class="hover:scale-110" />
      <Icon name="logos:github-icon" size="24" class="hover:scale-110" />
      <Icon name="logos:facebook" size="24" class="hover:scale-110" />
    </div>

    <UDivider
      label="Or"
      class="my-4"
      :ui="{ border: { base: 'flex border-gray-800 dark:border-gray-100' } }"
    />

    <UForm
      @submit="handleSubmit"
      @error="useOnError($event)"
      :state="credentials"
      :schema="loginSchema"
      class="space-y-4"
    >
      <UFormGroup label="Email" name="email" required size="lg">
        <UInput v-model="credentials.email" type="email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password" required size="lg">
        <UInput v-model="credentials.password" type="password" />
      </UFormGroup>

      <UFormGroup>
        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="credentials.remember"
            name="notifications"
            label="Notifications"
          />

          <NuxtLink to="/" class="text-sm text-blue-500 hover:underline">
            Forgot password?
          </NuxtLink>
        </div>
      </UFormGroup>

      <UFormGroup>
        <UButton
          :loading="isLoading"
          type="submit"
          color="black"
          size="lg"
          block
          label="LOGIN"
        />
        <p class="text-sm mt-2">
          Don't have an account?
          <span
            @click="emit('handleEmit')"
            class="text-blue-500 ml-2 cursor-pointer hover:underline"
            >Sign up</span
          >
        </p>
      </UFormGroup>
    </UForm>

    <!-- <Theme /> -->
  </div>
</template>

<script setup lang="ts">
import { type LoginSchema, loginSchema } from "~/schemas/zod";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits(["handleEmit"]);
const { login } = useAuth();

const credentials = ref({
  email: "xavotog865@inikale.com",
  password: "123123123",
  remember: false,
});
const isLoading = ref(false);

async function handleSubmit(event: FormSubmitEvent<LoginSchema>) {
  try {
    isLoading.value = true;
    await login(event.data.email, event.data.password);
  } catch (error: any) {
    throw showError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
