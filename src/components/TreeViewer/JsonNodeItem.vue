<script setup lang="ts">
import type { ASTNode } from "@/types/Node";
import { computed } from "vue";
import Json from "./Json.vue";

const { node } = defineProps<{
  node: ASTNode;
}>();

const data = computed(() =>
  Object.entries(node.data).map(([k, v]) => [
    k as string,
    typeof v === "object" ? (JSON.stringify(v) as string) : v,
  ]),
);
</script>

<template>
  <q-expansion-item
    dense
    :label="node.kind"
  >
    <template #header>
      <div class="flex w-full items-center gap-2">
        <span class="font-mono font-bold text-teal-500">EXPR</span>
        <span class="text-neutral-300">{{ node.kind }}</span>
      </div>
    </template>
    <div class="pl-6">
      <div
        class="text-neutral-400"
        v-for="[key, value] in data"
        :key="key"
      >
        <span>{{ key }}: </span>
        <span>{{ value }} </span>
      </div>
      <Json
        v-if="node.body.length"
        :nodes="node.body"
      />
    </div>
  </q-expansion-item>
</template>

<style lang="scss" scoped></style>
