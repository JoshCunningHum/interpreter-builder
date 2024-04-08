<script setup lang="ts">
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import { useParserStore } from "@/stores/parser";
import genidnum from "@/utils/genidnum";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated, ref } from "vue";
import Editing from "./Editing.vue";
import Testing from "./Testing.vue";
import Docs from "./doc.vue";

const emit = defineEmits<{
    (e: "initializeAddHook", func: () => void): void;
}>();

const parseStore = useParserStore();
const { parseRules } = storeToRefs(parseStore);

// Adding Rules
const add = () => {
    get(parseRules).push({
        id: genidnum(),
        match: `(({ pool, T, N }) => {
      // Enter pattern matching logic here \n})`,
        mapper: `(({ pool, setKind, setBody, setData, start, end }) => {
        // Enter mapping here \n})`,
        name: "",
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
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Parsing Rules"
            description="Catch patterns and return a node structure to produce the AST"
            io-key="ParseRules"
        >
            <template #actions>
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
                    :icon="['mdi-pencil', 'mdi-format-letter-matches'][mode]"
                    :label="Mode[mode]"
                />
            </template>

            <template #docs>
                <Docs />
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
