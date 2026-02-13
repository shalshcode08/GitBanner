<script setup lang="ts">
import { SidebarTrigger } from "~/components/ui/sidebar";
import ThemeToggle from "./theme/ThemeToggle.vue";
</script>

<template>
    <header class="h-16 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
            <SidebarTrigger class="w-9 h-9 rounded-md bg-background hover:bg-accent transition-colors" />
            <ThemeToggle />
        </div>
    </header>
</template>
