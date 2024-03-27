<script setup lang="ts">
import { useInterpreterStore } from "@/stores/interpreter";
import { storeToRefs } from "pinia";
import { get, set } from "@vueuse/core";
import { computed } from "vue";
import LogItem from "./LogItem.vue";

const interpretStore = useInterpreterStore();
const { interpreterValues } = storeToRefs(interpretStore);

const logs = computed(() => get(interpreterValues)?.logs || []);
</script>

<template>
    <div>
        {{ logs.length }}
        <LogItem
            v-for="(log, i) in logs"
            :key="i"
            :log="log"
        />
    </div>
</template>

<style lang="scss" scoped></style>
