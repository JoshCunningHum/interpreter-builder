<script setup lang="ts">
import { ref, watch } from "vue";
import ProcessTabs from "../ProcessTabs.vue";
import Token from "./Token/index.vue";
import Parse from "./Parse/index.vue";
import Interpreter from "./Interpret/index.vue";
import Reserves from "./Reserves/index.vue";
import { get, set } from "@vueuse/core";

const tabs = [Reserves, Token, Parse, Interpreter];
const tab = ref(0);

const prepends = [
  {
    label: "Reserve Words",
    icon: "mdi-alphabetical-variant",
  },
];

const addAction = ["Tokens", "Reserve Words", "Parse Trees"];

const addHookFunc = ref<() => void>();
watch(tab, () => set(addHookFunc, undefined));

const onAdd = () => {
  if (addHookFunc.value) addHookFunc.value();
};
</script>

<template>
  <div class="flex h-screen">
    <process-tabs
      @add="onAdd"
      :add-actions="addAction"
      :prepend="prepends"
      v-model="tab"
    />
    <q-tab-panels
      v-model="tab"
      animated
      vertical
      class="flex-grow"
    >
      <q-tab-panel
        v-for="(t, i) in tabs"
        :key="i"
        :name="i"
        class="flex w-full"
      >
        <keep-alive>
          <component
            :is="t"
            @initializeAddHook="(func: () => void) => (addHookFunc = func)"
            class="flex-grow"
          />
        </keep-alive>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style lang="scss" scoped></style>
