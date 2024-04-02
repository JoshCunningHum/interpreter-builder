<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import { storeToRefs } from "pinia";

const ideStore = useIdeStore();
const { execute } = ideStore;

const { current } = storeToRefs(ideStore);

</script>

<template>
  <div class="bg-primary flex justify-between px-4">
    <div>
      <q-item></q-item>
    </div>
    <div class="flex items-center h-full gap-2">
      <q-btn color="green-9" :disabled="!current" @click="execute">Execute</q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
