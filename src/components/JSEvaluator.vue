<script setup lang="ts">
import isFirefox from "@/utils/isFirefox";
import { set } from "@vueuse/core";
import { computed, ref } from "vue";

const { args: __args__ = [], code } = defineProps<{
  code: string;
  args?: any[];
}>();

const ___isError___ = ref(false);
const result = computed(() => {
  set(___isError___, false);

  const args = __args__;
  try {
    return eval(code);
  } catch (e: any) {
    set(___isError___, true);

    return `${e}\n${isFirefox() ? ` at ${e.lineNumber}:${e.columnNumber}` : ""}`;
  }
});
</script>

<template>
  <div class="bg-primary px-4 py-2 font-mono">
    <div class="text-xs">Result:</div>
    <pre
      class="pl-2"
      :class="[___isError___ && 'text-red']"
      >{{ result }}</pre
    >
  </div>
</template>

<style lang="scss" scoped></style>
