<script setup lang="ts">
import FileEditor from "./FileEditor.vue";
import FileList from "./FileList.vue";
</script>

<template>
    <div class="relative flex h-screen flex-nowrap">
        <FileList />
        <FileEditor />
    </div>
</template>

<style lang="scss" scoped></style>
