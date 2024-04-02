<script setup lang="ts">
import { type InterpretLog } from "@/logic/interpreter";
import { useInterpreterStore } from "@/stores/interpreter";
import { get, useArrayFind, useArrayFindIndex } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import LogItemTabs from "./LogItemTabs.vue";

const { log } = defineProps<{
    log: InterpretLog;
}>();

const interpretStore = useInterpreterStore();
const { errorLists, evalDefs } = storeToRefs(interpretStore);

const error = useArrayFind(
    errorLists,
    (v) => "error" in log && v.id === log.error,
);

const { rule } = log;
const index = useArrayFindIndex(evalDefs, (i) => i.id === rule?.id);

// Error Display
const isError = computed(() => ("error" in log && log.error) || !!get(error));

// Expansion
const isExpanded = ref(false);
</script>

<template>
    <q-expansion-item
        group="evallogs"
        :class="[isExpanded && 'bg-grey-9']"
        v-model="isExpanded"
    >
        <template #header>
            <q-item-section side>
                <q-icon
                    v-if="isError"
                    name="mdi-alert"
                    class="text-red-500"
                />
                <span
                    v-else-if="rule"
                    class="font-bold"
                    >{{ index }}
                </span>
            </q-item-section>
            <q-item-section>
                <q-item-label
                    class="font-medium uppercase"
                    :class="[isError ? 'text-red-600' : '']"
                >
                    {{
                        error
                            ? `Error | ${error.type}
                        ${log.rule && `[${log.rule.kind}]`}`
                            : log.node.kind
                    }}
                </q-item-label>
                <q-item-label caption
                    ><span class="text-neutral-400">{{
                        error ? error.e.message : log.result?.type
                    }}</span></q-item-label
                >
            </q-item-section>
        </template>
        <template #default>
            <LogItemTabs :log="log" />
        </template>
    </q-expansion-item>
</template>

<style lang="scss" scoped></style>
