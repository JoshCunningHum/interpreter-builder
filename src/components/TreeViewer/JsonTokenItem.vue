<script setup lang="ts">
import { useTokenStore } from "@/stores/token";
import type { Token } from "@/types/Token";
import { useArrayFind } from "@vueuse/core";
import { storeToRefs } from "pinia";

const { token } = defineProps<{
  token: Token;
}>();

const tokenStore = useTokenStore();
const { tokens } = storeToRefs(tokenStore);
const tokenDef = useArrayFind(tokens, (t) => t.id === token.type);
</script>

<template>
  <q-item>
    <q-item-section>
      <q-item-label class="flex gap-2">
        <span class="font-mono font-bold text-red-500">TKN</span>
        <span class="text-neutral-300">{{ tokenDef?.name }}</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>{{ token.value }}</q-item-section>
  </q-item>
</template>

<style lang="scss" scoped></style>
