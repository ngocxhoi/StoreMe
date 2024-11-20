<template>
  <div
    class="w-full max-w-xl flex flex-col justify-center shadow-md rounded-xl bg-gray-100 dark:bg-gray-800 dark:shadow-white p-10"
  >
    <div class="flex items-center gap-4">
      <h1 class="text-2xl">Sign up with :</h1>
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
      :schema="registerSchema"
      class="space-y-4"
    >
      <UFormGroup label="Name" name="name" required size="lg">
        <UInput v-model="credentials.name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email" required size="lg">
        <UInput v-model="credentials.email" type="email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password" required size="lg">
        <UInput v-model="credentials.password" type="password" />
      </UFormGroup>

      <UFormGroup
        label="Password Confirm"
        name="passwordConfirm"
        required
        size="lg"
      >
        <UInput v-model="credentials.passwordConfirm" type="password" />
      </UFormGroup>

      <UFormGroup>
        <div class="flex items-center justify-end">
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
          label="SIGNUP"
        />
        <p class="text-sm mt-2">
          Already have an account?
          <span
            @click="emit('handleEmit')"
            class="text-blue-500 ml-2 cursor-pointer hover:underline"
            >Login</span
          >
        </p>
      </UFormGroup>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { type RegisterSchema, registerSchema } from "~/schemas/zod";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits(["handleEmit"]);
const { createAccount } = useDatabase();

const credentials = ref({
  name: "Phoebe Roy",
  email: "xavotog865@inikale.com",
  password: "123123123",
  passwordConfirm: "123123123",
});

const isLoading = ref(false);

async function handleSubmit(event: FormSubmitEvent<RegisterSchema>) {
  try {
    isLoading.value = true;

    await createAccount(event.data.name, event.data.email, event.data.password);
  } catch (error: any) {
    throw showError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
