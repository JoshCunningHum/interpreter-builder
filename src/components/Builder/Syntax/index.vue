<script setup lang="ts">
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import { set } from "@vueuse/core";
import { onActivated, ref } from "vue";

const emit = defineEmits<{
    (e: "initializeAddHook", func: () => void): void;
}>();

const add = () => {
    // TODO: Add here
};

onActivated(() => emit("initializeAddHook", add));

// Collapse/Uncollapse

const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Syntax Magic"
            description="Transform some node patterns in the AST before runtime"
        />
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
