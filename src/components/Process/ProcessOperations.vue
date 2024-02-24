<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import type { CodeFile } from "@/types/CodeFile";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const emit = defineEmits<{
  (e: "execute", f: CodeFile): void;
}>();

const ideStore = useIdeStore();
const { files } = storeToRefs(ideStore);

const file = ref<CodeFile>();

const execute = () => {
  if (!file.value) return;
  emit("execute", file.value);
};
</script>

<template>
  <div class="bg-primary flex justify-between py-0.5">
    <q-item dense>
      <q-item-section>
        <div class="flex gap-2">
          <q-select
            class="min-w-48"
            :class="{
              'text-muted': !file,
            }"
            v-model="file"
            :options="files"
            dense
            options-dense
            option-label="name"
            label-color="white"
            hide-bottom-space
            label="Selected File"
            input-class="text-muted"
            square
            filled
            outlined
            :display-value="
              file ? file.name || 'Empty File Name' : 'No File Selected'
            "
            options-selected-class="text-amber-500"
          >
          </q-select>
          <q-btn
            color="green-9"
            @click="execute"
          >
            Execute
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<style lang="scss" scoped></style>
