<script setup lang="ts">
import { computed } from "vue";
import { type Tab } from "./ProcessTabs.vue";
import { useTrueAlways } from "@/hooks/useTrueAlways";

const { t } = defineProps<{
    t: Tab;
}>();

const emit = defineEmits<{
    (e: "add", name: string): void;
}>();

const tab = defineModel<string>();
const isExpanded = computed({
    get: () =>
        tab.value === t.label ||
        t.children.some((st) => st.label === tab.value),
    set: (v: boolean) => {},
});

const truealways = useTrueAlways();
</script>

<template>
    <q-expansion-item
        class="w-full"
        dense
        header-class="w-full flex-grow"
        header-style=""
        hide-expand-icon
        v-model="truealways"
    >
        <template #header>
            <div class="group flex flex-grow items-center gap-2 py-2">
                <q-icon
                    size="sm"
                    :name="t.icon"
                />
                <div class="flex-grow text-left">
                    {{ t.label }}
                </div>
                <q-icon
                    v-if="t.addAction"
                    @click="emit('add', t.label)"
                    class="opacity-0 group-hover:opacity-100"
                    size="sm"
                    name="mdi-plus"
                />
            </div>
        </template>

        <q-list
            class="ml-4 border-l"
            v-if="t.children.length > 0"
        >
            <q-item
                dense
                clickable
                v-for="st in t.children"
                :key="st.label"
                @click="
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        tab = st.label;
                    }
                "
                :class="tab === st.label && 'border-r-2 border-white'"
            >
                <div class="group flex flex-grow items-center gap-2 py-1">
                    <q-icon
                        size="sm"
                        :name="st.icon"
                    />
                    <div class="flex-grow text-left">
                        {{ st.label }}
                    </div>
                    <q-icon
                        v-if="t.addAction"
                        @click="emit('add', st.label)"
                        class="opacity-0 group-hover:opacity-100"
                        size="sm"
                        name="mdi-plus"
                    />
                </div>
            </q-item>
        </q-list>
    </q-expansion-item>
</template>

<style lang="scss" scoped></style>
