<script setup lang="ts">
import { EditorView, ViewUpdate } from "@codemirror/view";
import { Codemirror } from "vue-codemirror";
import { barf } from "thememirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const code = defineModel<string>({ default: "" });
</script>

<template>
  <Codemirror
    class="no-shadow cursor-text outline-none"
    v-model="code"
    placeholder="Enter JS Code"
    :indent-with-tab="true"
    :tab-size="4"
    :extensions="[javascript(), oneDark]"
  >
  </Codemirror>
</template>

<style lang="scss" scoped>
.outline-none {
  .cmeditor {
    outline: none !important;
  }
}
</style>
