<script setup lang="ts">
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import { useSwitchSet } from "@/hooks/useSwitchSet";
import { useTokenStore } from "@/stores/token";
import type { TokenDef } from "@/types/Token";
import genidnum from "@/utils/genidnum";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onActivated, ref } from "vue";
import draggable from "vuedraggable";
import Docs from "./doc.vue";

const emit = defineEmits<{
    (e: "initializeAddHook", func: () => void): void;
}>();

const tokenStore = useTokenStore();
const { tokens } = storeToRefs(tokenStore);

const add = () => {
    get(tokens).push({
        id: genidnum(),
        match: `(({ slice, whole }) => {
    // Enter token finding logic here...
})`,
        name: "",
    });
};

onActivated(() => emit("initializeAddHook", add));

// Toggling collapse and expand for all items
const collapseSignal = ref(1);
const collapseReset = () => set(collapseSignal, 0);
const oncollapse = () => useSwitchSet(collapseSignal, [[-1, 1], [0, 1], [-1]]);

// Lazy Load Item Component
const LazyItem = defineAsyncComponent(() => import("./Item.vue"));
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Define Tokens"
            description="Define token and the pattern capture logic"
            io-key="TokenDefinitions"
        >
            <template #actions>
                <q-btn @click="oncollapse"
                    >{{
                        collapseSignal === -1 ? "Expand" : "Collapse"
                    }}
                    All</q-btn
                >
            </template>
            <template #docs>
                <Docs />
            </template>
        </ProcessTabTitle>

        <div
            v-if="tokens.length === 0"
            class="flex flex-grow items-center justify-center"
        >
            <div class="text-h5 text-muted select-none">
                No Token Definitions
            </div>
        </div>
        <q-scroll-area
            v-else
            class="mt-2 flex-grow"
        >
            <draggable
                class="flex flex-col gap-4"
                v-model="tokens"
                item-key="id"
                :animation="200"
                group="token-definitinos"
                ghostClass="opacity-25"
                handle=".handle"
            >
                <template
                    #item="{
                        element: t,
                        index: i,
                    }: {
                        element: TokenDef;
                        index: number;
                    }"
                >
                    <LazyItem
                        :collapse="collapseSignal"
                        @collapseReset="collapseReset"
                        :def="t"
                        :key="t.id"
                        :index="i"
                    />
                </template>
            </draggable>
        </q-scroll-area>
        <!-- <q-btn
      @click="add"
      color="primary"
      text-color="white"
      label="Add Token"
    /> -->
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
