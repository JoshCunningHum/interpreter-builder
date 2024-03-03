<script setup lang="ts">
import CMEditorJS from "@/components/CMEditorJS.vue";
import type { ParseRule } from "@/types/Node";
import { get, set } from "@vueuse/core";
import { toRefs, ref, watch, onMounted } from "vue";
import { useMax } from "@vueuse/math";
import { useQuasar } from "quasar";
import { useParserStore } from "@/stores/parser";
import { storeToRefs } from "pinia";

// Define Component Interfaces

const props = withDefaults(
  defineProps<{
    rule: ParseRule;
    index: number;
    collapse?: number;
    splitter?: number;
  }>(),
  {
    splitter: 50,
  },
);

const emit = defineEmits<{
  (e: "collapseReset"): void;
  (e: "splitterMove", n: number): void;
}>();

const parseStore = useParserStore();

// Display Data

const { rule, collapse: collapseSignal, splitter } = toRefs(props);

// Collapse/Uncollapse

const isCollapsed = ref(false);

const collapse = () => set(isCollapsed, true);
const expand = () => set(isCollapsed, false);

watch(collapseSignal, (s) => {
  if (!s) return;
  s > 0 ? expand() : s < 0 ? collapse() : null;
});

const toggleCollapse = () => {
  set(isCollapsed, !get(isCollapsed));
  emit("collapseReset");
};

// Splitter

const resizeSplitter = (v: number) => {
  emit("splitterMove", v);
};

const matchEditor = ref<InstanceType<typeof HTMLDivElement>>();
const mapperEditor = ref<InstanceType<typeof HTMLDivElement>>();

const leftHeight = ref(999);
const rightHeight = ref(999);
const maxHeight = useMax(leftHeight, rightHeight);

const recomputeEditorHeight = () => {
  const left = matchEditor.value?.scrollHeight;
  const right = mapperEditor.value?.scrollHeight;
  if (left) set(leftHeight, left);
  if (right) set(rightHeight, right);
};

watch(
  [() => rule.value.match, () => rule.value.mapper, isCollapsed],
  recomputeEditorHeight,
  { immediate: true },
);

onMounted(() => recomputeEditorHeight());

// Delete

const q = useQuasar();
const { parseRules } = storeToRefs(parseStore);

const remove = () => {
  q.dialog({
    title: "Delete Rule?",
    message: "Are you sure you want to delete rule?",
    cancel: true,
    class: "no-shadow",
  }).onOk(() => {
    get(parseRules).splice(props.index, 1);
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
      <q-item-section
        ><p class="text-subtitle2 flex items-center gap-4">
          <q-icon
            :name="`mdi-chevron-${isCollapsed ? 'down' : 'up'}`"
            size="sm"
            class="cursor-pointer"
            @click="toggleCollapse"
          />
          <span :class="[!rule.name && 'text-muted']">
            {{ rule.name || "Assign a rule name" }}

            <q-popup-edit
              square
              v-model="rule.name"
              #default="scope"
            >
              <q-input
                color="amber"
                label="Token name"
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
      :style="{
        maxHeight: (isCollapsed ? 0 : maxHeight) + 'px',
      }"
    >
      <q-splitter
        :limits="[30, 70]"
        emit-immediately
        :model-value="splitter"
        @update:model-value="resizeSplitter"
        before-class="h-full flex-grow "
      >
        <template #before>
          <q-scroll-area
            class="h-auto flex-grow bg-[#282C33] transition-none"
            content-style="h-auto flex-grow bg-red"
            :style="{
              height: `calc(${maxHeight + 'px'} + 1rem)`,
            }"
          >
            <div
              class="bg-red"
              ref="matchEditor"
            >
              <CMEditorJS v-model="rule.match" />
            </div>
          </q-scroll-area>
        </template>
        <template #after>
          <q-scroll-area
            class="h-auto flex-grow bg-[#282C33] transition-none"
            content-style="h-auto flex-grow bg-red"
            :style="{
              height: `calc(${maxHeight + 'px'} + 1rem)`,
            }"
          >
            <div
              class="bg-red"
              ref="mapperEditor"
            >
              <CMEditorJS v-model="rule.mapper" />
            </div>
          </q-scroll-area>
        </template>
      </q-splitter>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
