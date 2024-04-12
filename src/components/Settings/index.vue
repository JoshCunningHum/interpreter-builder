<script setup lang="ts">
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import ProcessTabTitle from "../ProcessTabTitle.vue";
import Builder from "./builder.vue";
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Settings"
            description="These settings are only saved locally and per browser only."
        />

        <Builder />
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
