<script setup lang="ts">
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import { useInterpreterStore } from "@/stores/interpreter";
import genidnum from "@/utils/genidnum";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated, ref } from "vue";
import Editing from "./Editing.vue";
import Testing from "./Testing.vue";
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import Docs from "./docs.vue";

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

const toggleCollapse = () => {
    const current = get(collapseSignal);
    set(collapseSignal, current === -1 ? 1 : current === 0 ? 1 : -1);
};
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Evaluate Nodes"
            description="Create logic for each node type"
            io-key="EvalDefs"
        >
            <template #docs>
                <Docs />
            </template>
            <template #actions>
                <q-btn
                    v-show="mode === Mode.Editing"
                    @click="toggleCollapse"
                    >{{
                        collapseSignal === -1 ? "Expand" : "Collapse"
                    }}
                    All</q-btn
                >
                <q-btn
                    @click="mode = [1, 0][mode]"
                    :icon="['mdi-pencil', 'mdi-format-letter-matches'][mode]"
                    :label="Mode[mode]"
                />
            </template>
        </ProcessTabTitle>

        <Editing
            v-if="mode === Mode.Editing"
            :collapse-signal="collapseSignal"
            @collapse-reset="collapseReset"
        />
        <Testing v-else />
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
