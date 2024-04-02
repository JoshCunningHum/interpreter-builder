<script setup lang="ts">
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import CMEditorJS from "@/components/CMEditorJS.vue";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { glob, parse_err } = storeToRefs(globalStore);
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Global Runtime"
            description="Define globally used structure for interpreting"
        >
        </ProcessTabTitle>
        <q-scroll-area class="flex-grow">
            <q-item
                class="rounded bg-zinc-800"
                v-if="parse_err"
            >
                <q-item-section side>
                    <q-icon
                        name="mdi-alert"
                        class="text-red-500"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-subtitle1 font-bold">
                        Error Parsing Object
                    </q-item-label>
                    <q-item-label caption>
                        {{ parse_err.message }}
                    </q-item-label>
                </q-item-section>
            </q-item>
            <CMEditorJS v-model="glob" />
        </q-scroll-area>
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
