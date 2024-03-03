<script setup lang="ts">
import { type ParseProcessLog } from "@/stores/parser";

const { log } = defineProps<{
  log: ParseProcessLog;
}>();

const { matches, pool, rule, ruleIndex } = log;
</script>

<template>
  <q-expansion-item
    :label="rule.name"
    :label-lines="1"
    :caption="`${matches.length} match${matches.length - 1 ? 'es' : ''}`"
    dense
    :icon="`mdi-numeric-${ruleIndex}`"
    :header-class="`${matches.length ? '' : 'text-orange'} py-2`"
  >
  </q-expansion-item>
</template>

<style lang="scss" scoped></style>
