<script setup lang="ts">
import { useTokenStore } from "@/stores/token";
import genidnum from "@/utils/genidnum";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated, onMounted, onUpdated } from "vue";
import Item from "./Item.vue";
import { useImport } from "@/hooks/useImport";
import { useExport } from "@/hooks/useExport";

const emit = defineEmits<{
  (e: "initializeAddHook", func: () => void): void;
}>();

const tokenStore = useTokenStore();
const { reserves } = storeToRefs(tokenStore);

const add = () => {
  get(reserves).push({
    id: genidnum(),
    type: -1,
    value: "",
  });
};

onActivated(() => emit("initializeAddHook", add));
</script>

<template>
  <div class="flex flex-col gap-4">
    <q-item
      flat
      dense
    >
      <q-item-section>
        <div class="flex flex-col">
          <span class="text-xl font-medium">Define Reserve Words</span>
          <span class="text-hint text-xs"
            >Completely optional. Just an easier way to define reserve
            words.</span
          >
        </div>
      </q-item-section>
      <q-item-section side>
        <q-btn-group>
          <q-btn
            @click="useImport('ReserveWords')"
            icon="mdi-import"
            label="Import"
          />
          <q-btn
            @click="useExport('ReserveWords')"
            icon="mdi-export"
            label="Export"
          />
        </q-btn-group>
      </q-item-section>
    </q-item>
    <div
      v-if="reserves.length === 0"
      class="flex flex-grow items-center justify-center"
    >
      <div class="text-h5 text-muted select-none">
        No Assigned Reserve Words
      </div>
    </div>
    <q-scroll-area
      v-else
      class="flex-grow"
    >
      <div class="flex flex-wrap gap-2">
        <Item
          v-for="(r, i) in reserves"
          :key="r.id"
          :reserve="r"
          :index="i"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped></style>
