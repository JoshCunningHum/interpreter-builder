<script setup lang="ts">
import { ref, watch } from "vue";
import ProcessTabs, { type Tab } from "../ProcessTabs.vue";
import Token from "./Token/index.vue";
import Parse from "./Parse/index.vue";
import Interpreter from "./Interpret/index.vue";
import Reserves from "./Reserves/index.vue";
import Globals from "./Globals/index.vue";
import { get, set } from "@vueuse/core";

const tab = ref("Tokens");
const tabs: Tab[] = [
    {
        label: "Tokens",
        icon: "mdi-application-array-outline",
        addAction: true,
        component: Token,
        children: [
            {
                label: "Reserve Words",
                icon: "mdi-alphabetical-variant",
                addAction: true,
                component: Reserves,
                children: [],
            },
        ],
    },
    {
        label: "Parse Trees",
        icon: "mdi-graph-outline",
        addAction: true,
        component: Parse,
        children: [],
    },
    {
        label: "Interpret Code",
        icon: "mdi-code-tags",
        addAction: true,
        component: Interpreter,
        children: [
            {
                label: "Globals",
                icon: "mdi-web",
                addAction: false,
                component: Globals,
                children: [],
            },
        ],
    },
];
const tabs_flat = tabs.flatMap((tab) => [tab, ...tab.children]);

const addHookFunc = ref<() => void>();
watch(tab, () => set(addHookFunc, undefined));

const onAdd = () => {
    if (addHookFunc.value) addHookFunc.value();
};
</script>

<template>
    <div class="flex h-screen">
        <process-tabs
            @add="onAdd"
            v-model="tab"
            :tabs="tabs"
        />
        <q-tab-panels
            v-model="tab"
            animated
            keep-alive
            vertical
            class="flex-grow"
        >
            <q-tab-panel
                v-for="t in tabs_flat"
                :key="t.label"
                :name="t.label"
                class="flex w-full"
            >
                <component
                    :is="t.component"
                    @initializeAddHook="
                        (func: () => void) => (addHookFunc = func)
                    "
                    class="flex-grow"
                />
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<style lang="scss" scoped></style>
