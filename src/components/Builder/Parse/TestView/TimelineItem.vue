<script setup lang="ts">
import { type ParseProcessLog } from "@/stores/parser";
import Json from "@/components/TreeViewer/Json.vue";
import { computed, ref } from "vue";
import { checkASTHealth } from "@/logic/ast";

const { log } = defineProps<{
  log: ParseProcessLog;
}>();

const { matches, pool, rule, ruleIndex } = log;

const isHealthy = computed(() => checkASTHealth(log.pool));
</script>

<template>
  <q-expansion-item
    :label="rule.name"
    :label-lines="1"
    group="parse-testview-process"
    :caption="`${matches.length} match${matches.length - 1 ? 'es' : ''}`"
    dense
    :icon="`mdi-numeric-${ruleIndex}`"
    :header-class="`${matches.length ? '' : 'text-orange'} py-2`"
  >
    <template #header>
      <div class="flex flex-grow gap-4">
        <div class="text-overline flex w-4 items-center justify-center text-lg">
          <span v-if="isHealthy">{{ ruleIndex }}</span>
          <q-icon
            v-else
            name="mdi-alert"
            class="text-red-500"
          />
        </div>
        <div class="flex flex-grow flex-col">
          <div class="body2">{{ rule.name }}</div>
          <div class="text-caption text-hint">
            {{ matches.length }} match{{ matches.length - 1 ? "es" : "" }}
            <q-tooltip
              class="bg-neutral-800 px-2 py-1 text-xs text-neutral-300"
              v-if="matches.length"
              anchor="bottom left"
              self="top left"
            >
              <div
                v-for="(match, i) in matches"
                :key="`${match}-${i}`"
              >
                {{ match }}
              </div>
            </q-tooltip>
          </div>
        </div>
      </div>
    </template>
    <div class="ml-6 border-l">
      <Json :nodes="pool" />
    </div>
  </q-expansion-item>
</template>

<style lang="scss" scoped></style>
