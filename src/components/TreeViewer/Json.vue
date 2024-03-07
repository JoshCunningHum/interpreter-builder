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
  <div class="bg-neutral-300/5">
    <template
      v-for="(n, i) in nodes"
      :key="i"
    >
      <JsonNodeItem
        v-if="'kind' in n"
        :node="n"
      />

      <JsonTokenItem
        :token="n"
        v-else
      />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
./JsonNodeItem.vue
