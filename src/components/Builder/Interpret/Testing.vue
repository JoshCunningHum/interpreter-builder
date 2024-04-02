<script setup lang="ts">
import CMEditorCode from "@/components/CMEditorCode.vue";
import { useInterpreterStore } from "@/stores/interpreter";
import { useParserStore } from "@/stores/parser";
import getEnumKeys from "@/utils/getEnumKeys";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import {
    onActivated,
    onDeactivated,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from "vue";
import Logs from "@/components/Builder/Interpret/TestView/Logs.vue";
import Results from "./TestView/Results.vue";

// Splitter
const splitter_value = ref(50);

// Test
const interpretStore = useInterpreterStore();
const parserStore = useParserStore();
const { testSource } = storeToRefs(parserStore);
const { isTesting } = storeToRefs(interpretStore);
const auto_execute = ref(false);
const source = ref("");

const execute = () => {
    set(testSource, get(source));
};

watch(source, () => get(auto_execute) && execute());

// Modes
enum Mode {
    Logs,
    Result,
}

const modes = getEnumKeys(Mode).map((mode, i) => ({
    label: mode,
    value: i,
}));

const mode = ref(0);

// To determine whether we are testing or not
onMounted(() => {
    set(source, testSource.value);
    set(isTesting, true);
});
onUnmounted(() => {
    set(isTesting, false);
});
</script>

<template>
    <q-splitter
        :limits="[30, 70]"
        v-model="splitter_value"
        class="flex-grow gap-2"
    >
        <template #before>
            <q-scroll-area class="h-full rounded bg-[#2E3235]">
                <CMEditorCode v-model="source" />
            </q-scroll-area>
        </template>

        <template #after>
            <div class="flex h-full flex-col gap-2">
                <q-item class="pl-1">
                    <q-item-section>
                        <q-btn-toggle
                            v-model="mode"
                            toggle-color="secondary"
                            :options="modes"
                            dense
                            push
                            padding=".5rem 1rem"
                        />
                    </q-item-section>
                    <q-item-section side>
                        <q-btn-group>
                            <q-btn
                                v-if="!auto_execute"
                                label="Execute"
                                color="green-9"
                                @click="execute"
                            />
                            <q-btn
                                @click="auto_execute = !auto_execute"
                                :color="auto_execute ? 'green-9' : 'grey-9'"
                                :label="auto_execute ? 'Auto' : 'Manual'"
                            />
                        </q-btn-group>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn
                            icon="mdi-cog"
                            round
                        />
                    </q-item-section>
                </q-item>
                <div class="flex-grow">
                    <q-scroll-area class="h-full">
                        <Logs v-if="mode === Mode.Logs" />
                        <Results v-else />
                    </q-scroll-area>
                </div>
            </div>
        </template>
    </q-splitter>
</template>

<style lang="scss" scoped></style>
