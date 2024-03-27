<script setup lang="ts">
import { useProcessStore } from "@/stores/process";
import type { CodeFile } from "@/types/CodeFile";
import { ref } from "vue";
import ProcessTabs, { type Tab } from "../ProcessTabs.vue";
import Interpreter from "./Interpret/index.vue";
import Parse from "./Parse/index.vue";
import ProcessOperations from "./ProcessOperations.vue";
import Token from "./Token/index.vue";

const tab = ref("Tokens");
const tabs: Tab[] = [
    {
        label: "Tokens",
        icon: "mdi-application-array-outline",
        addAction: false,
        component: Token,
        children: [],
    },
    {
        label: "Parse Trees",
        icon: "mdi-graph-outline",
        addAction: false,
        component: Parse,
        children: [],
    },
    {
        label: "Interpret Code",
        icon: "mdi-code-tags",
        addAction: false,
        component: Interpreter,
        children: [],
    },
];

// Execute source code
const processStore = useProcessStore();

const exec = (f: CodeFile) => {
    console.log(f);
    processStore.execute(f);
};
</script>

<template>
    <div class="flex h-screen">
        <ProcessTabs
            v-model="tab"
            :tabs="tabs"
        />
        <div class="flex flex-grow flex-col">
            <ProcessOperations @execute="exec" />
            <q-tab-panels
                v-model="tab"
                animated
                keep-alive
                vertical
                class="flex-grow p-0"
            >
                <q-tab-panel
                    v-for="t in tabs"
                    :key="t.label"
                    :name="t.label"
                    class="flex w-full p-0"
                >
                    <component
                        :is="t.component"
                        class="flex-grow"
                    />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
