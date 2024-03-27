<script setup lang="ts">
import ObjectViewer from "@/components/ObjectViewer/ObjectViewer.vue";
import Json from "@/components/TreeViewer/Json.vue";
import JsonNodeItem from "@/components/TreeViewer/JsonNodeItem.vue";
import { type InterpretLog } from "@/logic/interpreter";
import { useInterpreterStore } from "@/stores/interpreter";
import { useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { log } = defineProps<{
    log: InterpretLog;
}>();

const interpretStore = useInterpreterStore();
const { errorLists } = storeToRefs(interpretStore);

const error = useArrayFind(
    errorLists,
    (v) => "error" in log && v.id === log.error,
);
</script>

<template>
    <q-expansion-item group="">
        <template #header>
            <template v-if="'error' in log && error">
                <q-item-section side>
                    <q-icon
                        name="mdi-alert"
                        class="text-red-500"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="font-medium uppercase text-red-600"
                        >Error | {{ error.type }}
                        {{ log.rule && `[${log.rule.kind}]` }}</q-item-label
                    >
                    <q-item-label caption
                        ><span class="text-neutral-400">{{
                            error.e.message
                        }}</span></q-item-label
                    >
                </q-item-section>
            </template>
            <template v-else>
                <q-item-section side>
                    <q-icon name="mdi-circle" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="font-medium uppercase">{{
                        log.node.kind
                    }}</q-item-label>
                    <q-item-label caption
                        ><span class="text-neutral-400">{{
                            log.result?.type
                        }}</span></q-item-label
                    >
                </q-item-section>
            </template>
        </template>
        <template #default>
            <div v-if="!!log.log">
                <template
                    v-for="(l, i) in log.log"
                    :key="i"
                >
                    <ObjectViewer
                        v-if="l !== undefined || l !== null"
                        :obj="l"
                /></template>
            </div>
            <ObjectViewer
                v-if="log.result"
                :obj="log.result"
            />
        </template>
    </q-expansion-item>
</template>

<style lang="scss" scoped></style>
