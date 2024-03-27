<script setup lang="ts">
import type { ASTNode } from "@/types/Node";
import Json from "./Json.vue";
import ObjectViewer from "../ObjectViewer/ObjectViewer.vue";
import { ref } from "vue";

const { node } = defineProps<{
    node: ASTNode;
}>();

// const data = computed(() =>
//   Object.entries(node.data).map(([k, v]) => [
//     k as string,
//     typeof v === "object" ? (JSON.stringify(v) as string) : v,
//   ]),
// );

// for hovering
const ishovering = ref(false);
</script>

<template>
    <q-expansion-item
        dense
        :label="node.kind"
    >
        <template #header>
            <div
                class="flex w-full items-center justify-between gap-2"
                @mouseenter="ishovering = true"
                @mouseleave="ishovering = false"
            >
                <div class="flex gap-1">
                    <span class="font-mono font-bold text-teal-500">EXPR</span>
                    <span class="text-neutral-300">{{ node.kind }}</span>
                </div>
                <div>
                    <q-btn
                        class="bg-opacity-0 p-0"
                        v-if="ishovering"
                        icon="mdi-code-tags"
                        dense
                        flat
                        @click="
                            (e) => {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                e.preventDefault();

                                console.log(node);
                            }
                        "
                    />
                </div>
            </div>
        </template>
        <div class="pl-6">
            <ObjectViewer
                :obj="node.data"
                :show-brackets="false"
            />
            <!-- <div
        class="text-neutral-400"
        v-for="[key, value] in data"
        :key="key"
      >
        <span>{{ key }}: </span>
        <span>{{ value }} </span>
      </div> -->
            <Json
                v-if="node && node.body && node.body.length"
                :nodes="node.body"
            />
            <div v-else-if="node === undefined">null</div>
            <div v-else-if="node === null">null</div>
        </div>
    </q-expansion-item>
</template>

<style lang="scss" scoped></style>
