<script setup lang="ts">
import Editor from "./Editor/index.vue";
import Builder from "./Builder/index.vue";
import Settings from "./Settings/index.vue";
import Process from "./Process/index.vue";
import { useUiStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const components = [Editor, Process, Builder, Settings];
const uiStore = useUiStore();
const { menu } = storeToRefs(uiStore);
</script>

<template>
  <q-page-container>
    <q-tab-panels
      v-model="menu"
      vertical
    >
      <q-tab-panel
        class="bg-dark p-0"
        :name="i"
        v-for="(c, i) in components"
        :key="i"
      >
        <component :is="c" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page-container>
</template>

<style lang="scss" scoped></style>
