<script setup lang="ts">
const { uppercase } = defineProps<{
    uppercase?: boolean;
}>();
</script>

<template>
    <div
        class="flex select-none items-center justify-center font-bold text-gray-500"
        :class="[uppercase && 'uppercase']"
    >
        <slot></slot>
    </div>
</template>
