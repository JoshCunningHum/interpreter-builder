<script setup lang="ts">
import ObjectViewer from "@/components/ObjectViewer/ObjectViewer.vue";
import { __undefined__, type RuntimeVal } from "@/logic/values";
import { useInterpreterStore } from "@/stores/interpreter";
import { set, watchImmediate } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const interpretStore = useInterpreterStore();
const { interpreterValues } = storeToRefs(interpretStore);

const result = ref<RuntimeVal>(__undefined__);

watchImmediate(interpreterValues, (v) => {
    setTimeout(() => {
        set(result, v?.getLast() || __undefined__);
    }, 10);
});
</script>

<template>
    <div class="px-4 py-2">
        <ObjectViewer :obj="result" />
    </div>
</template>

<style lang="scss" scoped></style>
