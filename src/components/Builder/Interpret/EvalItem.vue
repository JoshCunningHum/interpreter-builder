<script setup lang="ts">
import { useInterpreterStore } from "@/stores/interpreter";
import type { EvalDef } from "@/types/Evals";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import CMEditorJS from "@/components/CMEditorJS.vue";

const {
    def,
    collapse: collapseSignal,
    index,
} = defineProps<{
    def: EvalDef;
    index: number;
    collapse?: number;
}>();

const emit = defineEmits<{
    (e: "collapseReset"): void;
}>();

const interpreterStore = useInterpreterStore();

// Display Data
const { id, kind, logic } = def;

// Collapse/Uncollapse

const isCollapsed = ref(false);

const collapse = () => set(isCollapsed, true);
const expand = () => set(isCollapsed, false);
const collapsedComponent = ref<InstanceType<typeof HTMLDivElement>>();
const collapsedHeight = ref(9999);

watch(
    () => collapseSignal,
    (s) => {
        if (!s) return;
        s > 0 ? expand() : s < 0 ? collapse() : null;
    },
);

const toggleCollapse = () => {
    set(isCollapsed, !get(isCollapsed));
    emit("collapseReset");
};

const recomputeCollapseHeight = () => {
    setTimeout(() => {
        const sch = collapsedComponent.value?.scrollHeight;
        if (!sch) return;
        set(collapsedHeight, sch);
    }, 50);
};
watch([() => def.logic, isCollapsed], recomputeCollapseHeight, {
    immediate: true,
});

// Delete

const q = useQuasar();
const { evalDefs } = storeToRefs(interpreterStore);

const remove = () => {
    q.dialog({
        title: "Delete Eval Rule?",
        message: "Are you sure you want to delete evaluate definition?",
        cancel: true,
        class: "no-shadow",
    }).onOk(() => {
        get(evalDefs).splice(index, 1);
    });
};
</script>

<template>
    <q-card flat>
        <q-item class="bg-primary">
            <q-item-section
                side
                class="handle cursor-move"
            >
                <q-icon name="mdi-reorder-horizontal" />
            </q-item-section>
            <q-item-section>
                <p class="text-subtitle2 flex items-center gap-4">
                    <q-icon
                        :name="`mdi-chevron-${isCollapsed ? 'down' : 'up'}`"
                        size="sm"
                        class="cursor-pointer"
                        @click="toggleCollapse"
                    />
                    <span :class="[!def.kind && 'text-muted']">
                        {{ def.kind || "Assign a Node type" }}

                        <q-popup-edit
                            square
                            v-model="def.kind"
                            #default="scope"
                        >
                            <q-input
                                color="amber"
                                label="Assigned Node"
                                hint="Press enter to apply changes"
                                v-model="scope.value"
                                dense
                                autofocus
                                @keyup.enter="scope.set"
                            >
                                <template #prepend>
                                    <q-icon name="mdi-pencil" />
                                </template>
                            </q-input>
                        </q-popup-edit>
                    </span>
                </p>
            </q-item-section>
            <q-item-section side>
                <q-btn
                    flat
                    @click="remove"
                    round
                    padding="xs"
                    color="red"
                    icon="mdi-delete"
                />
            </q-item-section>
        </q-item>
        <div
            ref="collapsedComponent"
            class="overflow-hidden transition-all"
            :style="`max-height: ${isCollapsed ? 0 : collapsedHeight}px;`"
        >
            <CMEditorJS v-model="def.logic" />
        </div>
    </q-card>
</template>

<style lang="scss" scoped></style>
