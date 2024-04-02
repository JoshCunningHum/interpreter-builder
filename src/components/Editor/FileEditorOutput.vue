<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import { storeToRefs } from "pinia";
import OutputItem from "./OutputItem";

const ideStore = useIdeStore();
const { outputs } = storeToRefs(ideStore);
</script>

<template>
    <div
        class="bg-dark flex w-full content-start items-start justify-start p-2 font-mono"
    >
        <template
            v-for="(o, i) in outputs"
            :key="i"
        >
            <OutputItem
                v-if="'text' in o"
                :text="o.text"
            />
            <OutputItem
                v-else-if="'error' in o"
                :text="o.error"
                :error="true"
            />
            <OutputItem
                v-else
                @submit="
                    (msg) => {
                        o.answer(msg);
                        o.isScanning = false;
                        o.inputted = msg;
                    }
                "
                :scan="o.isScanning"
                :inputted="o.inputted"
            />
        </template>
    </div>
</template>

<style lang="scss" scoped></style>
