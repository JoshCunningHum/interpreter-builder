<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  prepend?: {
    label: string;
    icon: string;
  }[];
  append?: {
    label: string;
    icon: string;
  }[];
  addActions?: string[];
}>();

const emit = defineEmits<{
  (e: "add", index: number): void;
}>();

const tabs = computed(() => {
  return [
    ...(props.prepend || []),
    {
      label: "Tokens",
      icon: "mdi-application-array-outline",
    },
    {
      label: "Parse Trees",
      icon: "mdi-graph-outline",
    },
    {
      label: "Interpret Code",
      icon: "mdi-code-tags",
    },
    ...(props.append || []),
  ].map((obj, i) => ({ ...obj, name: i }));
});

const tab = defineModel<number>({ default: 0 });
</script>

<template>
  <div class="min-w-48 bg-primary">
    <q-tabs
      vertical
      dense
      inline-label
      align="left"
      :model-value="tab"
      @update:model-value="(i) => (tab = i)"
    >
      <q-tab
        class="justify-start flex"
        content-class="flex w-full"
        v-for="(t, i) in tabs"
        :key="t.label"
        :name="t.name"
      >
        <div class="py-2 flex-grow flex gap-2 items-center group">
          <q-icon
            size="sm"
            :name="t.icon"
          />
          <div class="flex-grow text-left">
            {{ t.label }}
          </div>
          <q-icon
            v-if="props.addActions?.includes(t.label)"
            @click="emit('add', i)"
            class="opacity-0 group-hover:opacity-100"
            size="sm"
            name="mdi-plus"
          />
        </div>
      </q-tab>
      <q-separator v-if="append" />
    </q-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
