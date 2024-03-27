<script setup lang="ts">
import { useExport, type IOCategories } from "@/hooks/useExport";
import { useImport } from "@/hooks/useImport";

const props = defineProps<{
    title: string;
    description: string;
    ioKey?: IOCategories;
}>();
</script>

<template>
    <q-item
        flat
        dense
    >
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
                        @click="useImport(ioKey)"
                        icon="mdi-import"
                        label="Import"
                    />
                    <q-btn
                        @click="useExport(ioKey)"
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
