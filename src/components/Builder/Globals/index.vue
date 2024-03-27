<script setup lang="ts">
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Global Runtime"
            description="Define globally used structure for interpreting"
        >
        </ProcessTabTitle>
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
