<script setup lang="ts">
import { useTokenStore } from "@/stores/token";
import type { TokenDef } from "@/types/Token";
import genidnum from "@/utils/genidnum";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import draggable from "vuedraggable";
import Item from "./Item.vue";

const emit = defineEmits<{
  (e: "initializeAddHook", func: () => void): void;
}>();

const tokenStore = useTokenStore();
const { tokens } = storeToRefs(tokenStore);

const add = () => {
  get(tokens).push({
    id: genidnum(),
    match: `((slice, whole) => {
    // Enter token finding logic here...
})(...args)`,
    name: "",
  });
};

onMounted(() => {
  emit("initializeAddHook", add);
});
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      v-if="tokens.length === 0"
      class="flex flex-grow items-center justify-center"
    >
      <div class="text-h5 text-muted select-none">No Token Definitions</div>
    </div>
    <template v-else>
      <div class="text-hint text-caption pb-4">
        Do note that escaping characters requires 2 backward slashes.
      </div>
      <q-scroll-area class="flex-grow">
        <draggable
          v-model="tokens"
          item-key="id"
          :animation="200"
          group="token-definitinos"
          ghostClass="opacity-25"
          handle=".handle"
        >
          <template
            #item="{
              element: t,
              index: i,
            }: {
              element: TokenDef;
              index: number;
            }"
          >
            <Item
              :def="t"
              :key="t.id"
              :index="i"
            />
          </template>
        </draggable>
      </q-scroll-area>
      <!-- <q-btn
      @click="add"
      color="primary"
      text-color="white"
      label="Add Token"
    /> -->
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
