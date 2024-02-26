<script setup lang="ts">
import CMEditorCode from "@/components/CMEditorCode.vue";
import CMEditorJS from "@/components/CMEditorJS.vue";
import { useTokenStore } from "@/stores/token";
import { type TokenDef } from "@/types/Token";
import { get, set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onMounted, ref, toRefs, watch } from "vue";
import MatchEvaluator from "./MatchEvaluator.vue";

const props = defineProps<{
  def: TokenDef;
  index: number;
  collapse?: number;
}>();

const emit = defineEmits<{
  (e: "collapseReset"): void;
}>();

const q = useQuasar();
const tokenStore = useTokenStore();

const { tokens } = storeToRefs(tokenStore);
const { def: token, collapse: collapseSignal } = toRefs(props);

const remove = () => {
  q.dialog({
    title: "Delete token?",
    message: "Are you sure you want to delete token?",
    cancel: true,
    class: "no-shadow",
  }).onOk(() => {
    get(tokens).splice(props.index, 1);
  });
};

// Test/Edit Mode

enum Mode {
  Edit,
  Test,
}

const mode = ref(Mode.Edit);
const testSrc = ref<string>("");

// Collapsible
const isCollapsed = ref(false);
const collapsedComponent = ref<InstanceType<typeof HTMLDivElement>>();
const collapsedHeight = ref(9999);

// useMutationObserver(
//   collapsedComponent,
//   () => {
//     const sch = collapsedComponent.value?.scrollHeight;
//     if (!sch) return;
//     set(collapsedHeight, sch);
//   },
//   { attributes: true, childList: true },
// );
const recomputeCollapseHeight = () => {
  setTimeout(() => {
    const sch = collapsedComponent.value?.scrollHeight;
    if (!sch) return;
    set(collapsedHeight, sch);
  }, 50);
};

watch(
  [testSrc, mode, () => token.value.match, isCollapsed],
  recomputeCollapseHeight,
  { immediate: true },
);

const collapse = () => set(isCollapsed, true);
const expand = () => set(isCollapsed, false);

watch(collapseSignal, (s) => {
  if (!s) return;

  if (s > 0) expand();
  else if (s < 0) collapse();
});

const toggleCollapse = () => {
  set(isCollapsed, !get(isCollapsed));
  emit("collapseReset");
};

onMounted(recomputeCollapseHeight);
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
          <span :class="[!token.name && 'text-muted']">
            {{ token.name || "Assign a token name" }}

            <q-popup-edit
              square
              @save="(v) => (token.name = v.replace(' ', '_'))"
              :model-value="token.name"
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
      <q-item-section
        side
        class="flex gap-2"
      >
        <q-btn-group>
          <q-btn
            flat
            @click="mode = mode == Mode.Edit ? Mode.Test : Mode.Edit"
            :icon="
              mode === Mode.Edit ? 'mdi-pencil' : 'mdi-format-letter-matches'
            "
            :label="mode === Mode.Edit ? 'Editing' : 'Testing'"
          />
          <q-btn
            flat
            @click="remove"
            round
            padding="xs"
            color="red"
            icon="mdi-delete"
          />
        </q-btn-group>
      </q-item-section>
    </q-item>

    <div
      ref="collapsedComponent"
      class="overflow-hidden transition-all"
      :style="`max-height: ${isCollapsed ? 0 : collapsedHeight}px;`"
    >
      <div v-if="mode === Mode.Edit">
        <CMEditorJS v-model="token.match" />
      </div>
      <div v-else>
        <CMEditorCode v-model="testSrc" />
        <MatchEvaluator
          :token="token"
          :test="testSrc"
        />
      </div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped></style>
