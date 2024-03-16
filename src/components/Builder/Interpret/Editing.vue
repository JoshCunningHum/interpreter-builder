<script setup lang="ts">
import { useInterpreterStore } from "@/stores/interpreter";
import type { EvalDef } from "@/types/Evals";
import { storeToRefs } from "pinia";
import { defineAsyncComponent } from "vue";
import draggable from "vuedraggable";

const { collapseSignal } = defineProps<{
    collapseSignal: number;
}>();

const emit = defineEmits<{
    (e: "collapseReset"): void;
}>();

const interpretStore = useInterpreterStore();
const { evalDefs } = storeToRefs(interpretStore);

// Collapse/Uncollapse
const collapseReset = () => emit("collapseReset");

// Lazy Load Item Component
const LazyItem = defineAsyncComponent(() => import("./EvalItem.vue"));
</script>

<template>
    <q-scroll-area class="flex-grow">
        <draggable
            class="flex flex-col gap-2"
            v-model="evalDefs"
            item-key="id"
            :animation="200"
            group="eval-definitions"
            ghostClass="opacity-25"
            handle=".handle"
            tag="div"
        >
            <template
                #item="{
                    element: d,
                    index: i,
                }: {
                    element: EvalDef;
                    index: number;
                }"
            >
                <LazyItem
                    :collapse="collapseSignal"
                    @collapseReset="collapseReset"
                    :def="d"
                    :index="i"
                />
            </template>
        </draggable>
    </q-scroll-area>
</template>

<style lang="scss" scoped></style>
