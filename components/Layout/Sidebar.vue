<template>
  <aside
    class="w-fit max-w-sm py-5 px-2 lg:px-10 rounded-xl shadow-lg dark:shadow-gray-700 hidden md:flex flex-col items-center justify-between"
  >
    <div class="space-y-8">
      <Logo :full-logo="true" />

      <nav class="rounded-xl shadow-lg dark:shadow-gray-700 py-4">
        <ul class="flex flex-1 flex-col p-4 gap-6">
          <NuxtLink
            :to="item.to"
            v-for="item in navItems"
            :key="item.title"
            class="flex items-center justify-center lg:justify-start w-full gap-2 p-2 lg:px-4 rounded-full shadow-md"
            :class="
              route.path == item.to
                ? 'bg-red-500 text-white dark:text-black'
                : 'hover:bg-red-500/40'
            "
          >
            <Icon :name="item.icon" size="24" />
            <span class="hidden lg:block">{{ item.title }}</span>
          </NuxtLink>
        </ul>
      </nav>

      <div
        class="w-full hidden lg:block shadow-lg dark:shadow-gray-700 rounded-xl"
      >
        <NuxtImg src="/img/login-nobg.png" class="w-full max-w-sm" />
      </div>
    </div>

    <UDropdown
      :items="itemsDropdown"
      :popper="{ placement: 'right-start' }"
      class="w-full [&>*]:transition-none"
    >
      <div
        class="rounded-xl w-full shadow-lg dark:shadow-gray-700 p-4 flex items-center justify-center lg:justify-start gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <UAvatar
          :src="
            accountState?.avatar ??
            'https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png'
          "
        />
        <div class="hidden lg:block">
          <p class="font-bold">{{ accountState?.fullName }}</p>
          <p class="text-gray-500 text-sm font-semibold">
            {{ accountState?.email }}
          </p>
        </div>
      </div>

      <template #theme="{ item }">
        <div class="flex items-center gap-2">
          <Icon
            :name="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            size="20"
          />
          <span>{{ item.label }}</span>
        </div>
      </template>

      <template #logout="{ item }">
        <div class="flex items-center gap-2 text-red-500">
          <Icon name="i-heroicons-arrow-right-start-on-rectangle" size="20" />
          <span class="font-semibold">{{ item.label }}</span>
        </div>
      </template>
    </UDropdown>
  </aside>
</template>

<script lang="ts" setup>
const route = useRoute();
const { accountState, navItems } = useStateGlobal();
const { logout } = useAuth();

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const itemsDropdown = [
  [
    {
      label: "Profile",
      avatar: {
        src:
          accountState.value?.avatar ??
          "https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png",
      },
    },
  ],

  [
    {
      label: "Setting",
      icon: "i-heroicons-cog-8-tooth",
    },
    {
      label: "Theme",
      slot: "theme",
      click: () => (isDark.value = !isDark.value),
    },
  ],
  [
    {
      label: "Logout",
      slot: "logout",
      click: async () => await logout(),
    },
  ],
];
</script>
