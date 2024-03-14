<script setup lang="ts">
import type { ASTNode } from "@/types/Node";
import type { Token } from "@/types/Token";
import JsonNodeItem from "./JsonNodeItem.vue";
import JsonTokenItem from "./JsonTokenItem.vue";

const { nodes } = defineProps<{
  nodes: (ASTNode | Token)[];
}>();
</script>

<template>
  <div
    class="bg-neutral-300/5"
    v-if="!!nodes"
  >
    <template
      v-for="(n, index) in nodes"
      :key="index"
    >
      <JsonNodeItem
        v-if="!!n && 'kind' in n"
        :node="n"
      />

      <JsonTokenItem
        v-else
        :token="n"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
