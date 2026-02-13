<script setup lang="ts">
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "~/components/ui/sidebar";
</script>

<template>
    <Sidebar variant="inset">
        <SidebarHeader class="h-16 w-full flex items-center justify-center p-0"
            ></SidebarHeader
        >
        <SidebarContent>
            <SidebarGroup>
                <!-- <SidebarGroupLabel>option</SidebarGroupLabel> -->
                <SidebarGroupContent>
                    <SidebarMenu>
                        <!-- <SidebarMenuItem>
                            <SidebarMenuButton as-child>
                                <p>onw</p>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton as-child>
                                <p>two</p>
                            </SidebarMenuButton>
                        </SidebarMenuItem> -->
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>
