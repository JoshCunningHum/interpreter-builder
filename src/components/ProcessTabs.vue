<script setup lang="ts">
import { computed, type DefineComponent } from "vue";
import ProcessTabsItem from "./ProcessTabsItem.vue";

export interface Tab {
    label: string;
    icon: string;
    addAction: boolean;
    component: any;
    children: Tab[];
}

const props = defineProps<{
    tabs: Tab[];
}>();

const emit = defineEmits<{
    (e: "add", name: string): void;
}>();

const tab = defineModel<string>();
</script>

<template>
    <div class="bg-primary min-w-60">
        <q-tabs
            vertical
            dense
            inline-label
            align="left"
            :model-value="tab"
            @update:model-value="(i) => (tab = i)"
        >
            <q-tab
                style="padding: 0"
                class="flex justify-start"
                content-class="flex w-full p-0 m-0"
                v-for="t in tabs"
                :key="t.label"
                :name="t.label"
            >
                <ProcessTabsItem
                    v-model="tab"
                    :t="t"
                    :key="t.label"
                    @add="(v) => emit('add', v)"
                />
            </q-tab>
        </q-tabs>
    </div>
</template>

<style lang="scss" scoped></style>
