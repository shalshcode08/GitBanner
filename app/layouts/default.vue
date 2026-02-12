<script setup lang="ts">
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import AppSidebar from "~/components/AppSidebar.vue";
import AppHeader from "~/components/AppHeader.vue";
</script>

<template>
    <SidebarProvider>
        <div class="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset class="flex flex-col">
                <AppHeader />
                <main class="flex-1 overflow-y-auto p-6">
                    <slot />
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
</template>
