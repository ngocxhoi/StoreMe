<template>
  <div class="relative flex h-screen min-w-[400px] overflow-clip">
    <section
      class="bg-gradient-to-tr from-[#FEFFA7] to-[#26be84] p-10 w-1/2 max-w-3xl hidden items-center justify-center lg:flex"
    >
      <div class="space-y-5 overflow-clip">
        <div class="border rounded-2xl">
          <Logo :full-logo="true" />
        </div>
        <div class="space-y-5 text-white">
          <h1 class="text-5xl font-semibold">
            Manage your files the bests way
          </h1>
          <p class="text-lg">
            This is a place where you can store all your files
          </p>
        </div>
        <NuxtImg src="/img/login-nobg.png" />
        <!-- <div class="flex gap-4">
          <Theme />
        </div> -->
      </div>
    </section>

    <section
      class="w-full flex flex-col flex-1 items-center justify-center p-10"
    >
      <div class="flex items-center mb-10 lg:hidden">
        <Logo />
        <h1 class="text-4xl font-semibold">StoreMe</h1>
      </div>
      <template v-if="isLogin">
        <AuthLogin @handleEmit="isLogin = !isLogin" />
      </template>

      <template v-else>
        <AuthSignUp @handleEmit="isLogin = !isLogin" />
      </template>
    </section>

    <UModal v-model="isOpenOTP">
      <OTPModal />
    </UModal>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Auth",
});

const { isOpenOTP } = useStateGlobal();

const isLogin = ref(true);
</script>

<style></style>
