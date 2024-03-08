<script setup lang="ts">
import { computed, ref } from "vue";
import ObjectViewer from "@/components/ObjectViewer/ObjectViewer.vue";

const { obj, showBrackets = true } = defineProps<{
  obj: Object | Array<any>;
  showBrackets?: boolean;
}>();

const isExpanded = ref(false);

const entries = computed(() =>
  Array.isArray(obj) && "length" in obj ? [] : Object.entries(obj),
);
</script>

<template>
  <template v-if="Array.isArray(obj) && 'length' in obj"
    >[
    <div
      v-if="isExpanded"
      class="inline-flex"
    >
      <div
        v-for="(item, i) in obj"
        :key="i"
      >
        <div v-if="typeof item === 'string'">"{{ item }}"</div>
        <div v-else-if="typeof item === 'number'">
          {{ item }}
        </div>
        <div
          class="flex"
          v-else-if="Array.isArray(item) && 'length' in item"
        >
          <span v-if="showBrackets">[</span>
          <ObjectViewer :obj="item" />
          <span
            v-if="showBrackets"
            class="place-self-end self-end justify-self-end"
            >]</span
          >
        </div>
        <div v-else-if="typeof item === 'object'">
          <span v-if="showBrackets">{</span>
          <ObjectViewer :obj="item" />
          <span
            v-if="showBrackets"
            class="place-self-end self-end justify-self-end"
            >}</span
          >
        </div>
        <span v-if="i < obj.length - 1">,</span>
      </div>
    </div>
    <div
      v-else
      @click="isExpanded = true"
    >
      ...
    </div>
    ]
  </template>
  <template v-else>
    <div
      class="flex gap-2 text-neutral-400"
      v-for="[key, value] in entries"
      :key="key"
    >
      <span>{{ key }}: </span>
      <span>
        <div v-if="typeof value === 'string'">"{{ value }}"</div>
        <div v-else-if="typeof value === 'number'">
          {{ value }}
        </div>
        <div v-else-if="Array.isArray(value) && 'length' in value">
          {{ showBrackets && "[" }}<ObjectViewer :obj="value" />{{
            showBrackets && "]"
          }}
        </div>
        <div v-else-if="typeof value === 'object'">
          {{ showBrackets && "{" }}<ObjectViewer :obj="value" />{{
            showBrackets && "}"
          }}
        </div>
      </span>
    </div>
  </template>
</template>

<style lang="scss" scoped></style>
