<script setup lang="ts">
const { title, description } = defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="bg-primary h-full min-h-0 w-[700px] !max-w-[80vw] overflow-y-auto p-3 px-5"
    >
        <q-scroll-area class="h-full">
            <h1
                class="text-h6"
                v-if="title"
            >
                {{ title }}
            </h1>
            <p
                v-if="description"
                class="text-body2 text-weight-light"
            >
                {{ description }}
            </p>
            <slot></slot>
        </q-scroll-area>
    </div>
</template>

<style lang="scss" scoped></style>
