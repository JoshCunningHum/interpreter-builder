<script setup lang="ts">
import { useExport, type IOCategories } from "@/hooks/useExport";
import { useImport } from "@/hooks/useImport";
import { computed, ref, useSlots } from "vue";

const { ioKey, title, description } = defineProps<{
    title: string;
    description: string;
    ioKey?: IOCategories;
}>();

const slots = defineSlots<{
    actions(): any;
    docs(): any;
}>();

const hasDoc = computed(() => !!slots.docs);
const showDoc = ref(false);
</script>

<template>
    <q-item
        flat
        dense
    >
        <q-item-section
            side
            v-if="hasDoc"
        >
            <q-btn
                icon="mdi-help-circle-outline"
                round
                dense
                @click="showDoc = !showDoc"
            />
            <q-dialog
                transition-show="slide-up"
                transition-hide="slide-down"
                v-model="showDoc"
            >
                <slot name="docs"></slot>
            </q-dialog>
        </q-item-section>
        <q-item-section>
            <div class="flex flex-col">
                <span class="text-xl font-medium">{{ title }}</span>
                <span class="text-hint text-xs">
                    {{ description }}
                </span>
            </div>
        </q-item-section>
        <q-item-section side>
            <q-btn-group>
                <template v-if="ioKey">
                    <q-btn
                        @click="useImport(ioKey!)"
                        icon="mdi-import"
                        label="Import"
                    />
                    <q-btn
                        @click="useExport(ioKey!)"
                        icon="mdi-export"
                        label="Export"
                    />
                </template>

                <slot name="actions"> </slot>
            </q-btn-group>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>
