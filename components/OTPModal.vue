<template>
  <!-- component -->
  <div class="flex flex-col justify-center items-center overflow-hidden">
    <div
      class="relative px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl"
    >
      <div class="mx-auto flex w-full flex-col space-y-10">
        <div
          class="flex flex-col items-center justify-center text-center space-y-2"
        >
          <div class="font-semibold text-3xl">
            <p>Email Verification</p>
          </div>
          <div class="flex flex-col text-sm font-medium text-gray-400">
            <p>We have sent a code to your email</p>
            <p>{{ accountState?.email }}</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit()">
          <div class="flex flex-col space-y-10">
            <div
              class="flex flex-wrap gap-3 items-center justify-center mx-auto w-full"
            >
              <input
                v-for="el in 6"
                v-model="OTP[el - 1]"
                :key="el"
                class="otpClass size-14 flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 dark:border-gray-200 text-lg focus:bg-gray-200 dark:focus:bg-gray-600/80 focus:ring-1 ring-blue-700"
                type="number"
                min="0"
                max="9"
                name="otp"
                :id="`otp${el}`"
              />
            </div>

            <div class="flex flex-col space-y-5">
              <UButton
                :loading="isLoading"
                type="submit"
                label="Verify Account"
                block
                color="black"
                size="xl"
              />

              <div
                class="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500"
              >
                <p>Didn't receive code?</p>
                <a
                  v-if="!isResend"
                  @click="handleResend()"
                  class="hover:underline text-blue-500 cursor-pointer"
                  target="_blank"
                  >Resend</a
                >
                <span class="text-blue-500" v-else>{{ countdownTime }}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type OTPType = {
  [key: number]: number | null;
};

const { accountState } = useStateGlobal();
const { sendEmailOTP, verifySecret } = useAuth();

const OTP = ref<OTPType>({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
});
const isResend = ref(false);
const countdownTime = ref(0);
const isLoading = ref(false);

async function handleSubmit() {
  try {
    isLoading.value = true;
    const secret = toArrayString(OTP.value);
    const sessionId = await verifySecret(accountState.value?.accountId, secret);
    if (sessionId) navigateTo("/dashboard");
  } catch (error: any) {
    throw showError(error);
  } finally {
    isLoading.value = false;
  }
}

async function handleResend() {
  try {
    isResend.value = true;
    await sendEmailOTP(accountState.value.$id, accountState.value.email);
  } catch (error: any) {
    throw showError(error);
  } finally {
    await countdown(countdownTime, 60);
    isResend.value = false;
  }
}

onMounted(() => {
  const element = document.getElementById("otp1");
  element?.focus();

  const opts = document.getElementsByClassName("otpClass");
  for (let i = 0; i < 5; i++) {
    const element = opts[i] as HTMLInputElement;
    const nextElement = opts[i + 1] as HTMLInputElement;
    element?.addEventListener("input", () => {
      if (element.value) nextElement?.focus();
    });
  }
});
</script>

<style>
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
