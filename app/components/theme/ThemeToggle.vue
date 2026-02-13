<script setup lang="ts">
import { computed } from "vue"
import { HugeiconsIcon } from "@hugeicons/vue"
import {
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"

const colorMode = useColorMode()

if (colorMode.preference === "system") {
  colorMode.preference = "light"
}

const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark"
}
</script>

<template>
  <button @click="toggleTheme"
    class="flex items-center justify-center w-9 h-9 rounded-md bg-background hover:bg-accent transition-colors">
    <HugeiconsIcon v-if="isDark" :icon="Sun01Icon" class="w-4 h-4" />
    <HugeiconsIcon v-else :icon="Moon02Icon" class="w-4 h-4" />
  </button>
</template>
