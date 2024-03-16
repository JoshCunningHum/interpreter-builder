<script setup lang="ts">
import { useExport } from "@/hooks/useExport";
import { useImport } from "@/hooks/useImport";
import { useInterpreterStore } from "@/stores/interpreter";
import genidnum from "@/utils/genidnum";
import { set, get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated, ref } from "vue";
import Editing from "./Editing.vue";
import Testing from "./Testing.vue";

const emit = defineEmits<{
    (e: "initializeAddHook", func: () => void): void;
}>();

const interpretStore = useInterpreterStore();
const { evalDefs } = storeToRefs(interpretStore);

const add = () => {
    get(evalDefs).push({
        id: genidnum(),
        kind: "",
        logic: `(({ execute, N, setKind, setValue, children, data }) => {
    // Enter execution logic for each kind of Node

})`,
    });
};

onActivated(() => emit("initializeAddHook", add));

// Collapse/Uncollapse

const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);

// Edit/Test Mode

enum Mode {
    Editing,
    Testing,
}

const mode = ref(Mode.Editing);
</script>

<template>
    <div class="flex h-full flex-col gap-2">
        <q-item
            flat
            dense
        >
            <q-item-section>
                <div class="flex flex-col">
                    <span class="text-xl font-medium">Evaluate Nodes</span>
                    <span class="text-hint text-xs">
                        Create logic for each node type
                    </span>
                </div>
            </q-item-section>
            <q-item-section side>
                <q-btn-group>
                    <q-btn
                        @click="useImport('EvalDefs')"
                        icon="mdi-import"
                        label="Import"
                    />
                    <q-btn
                        @click="useExport('EvalDefs')"
                        icon="mdi-export"
                        label="Export"
                    />
                    <q-btn
                        v-show="mode === Mode.Editing"
                        @click="
                            collapseSignal =
                                collapseSignal === -1
                                    ? 1
                                    : collapseSignal === 0
                                      ? 1
                                      : -1
                        "
                        >{{
                            collapseSignal === -1 ? "Expand" : "Collapse"
                        }}
                        All</q-btn
                    >
                    <q-btn
                        @click="mode = [1, 0][mode]"
                        :icon="
                            ['mdi-pencil', 'mdi-format-letter-matches'][mode]
                        "
                        :label="Mode[mode]"
                    />
                </q-btn-group>
            </q-item-section>
        </q-item>

        <Editing
            v-if="mode === Mode.Editing"
            :collapse-signal="collapseSignal"
            @collapse-reset="collapseReset"
        />
        <Testing v-else />
    </div>
</template>

<style lang="scss" scoped></style>
