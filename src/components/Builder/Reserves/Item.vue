<script setup lang="ts">
import { useTokenStore } from "@/stores/token";
import type { ReservedWord, TokenDef } from "@/types/Token";
import { get, toRefs } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed } from "vue";

const q = useQuasar();

const props = defineProps<{
  reserve: ReservedWord;
  index: number;
}>();

const { reserve: word } = toRefs(props);

const tokenStore = useTokenStore();
const { reserves, tokensSorted: tokens } = storeToRefs(tokenStore);

const definition = computed({
  get: () => get(tokens).find((t) => t.id === word.value.type),
  set: (def: TokenDef | undefined) => (word.value.type = def?.id || -1),
});

const remove = () => {
  q.dialog({
    title: "Remove reserved word",
    message: "Are you sure you want to remove this as a reserved word?",
    cancel: true,
    transitionShow: "transition-none",
    transitionHide: "transition-none",
    class: "transition-none",
  }).onOk(() => {
    get(reserves).splice(props.index, 1);
  });
};
</script>

<template>
  <q-card
    flat
    bordered
    class="min-w-28"
  >
    <q-item>
      <q-item-section>
        <p
          class="text-subtitle2 font-mono font-bold"
          :class="[!reserve.value && 'text-muted']"
        >
          {{ reserve.value || "Assign a word" }}
          <q-popup-edit
            square
            cover
            v-model="reserve.value"
            #default="scope"
          >
            <q-input
              color="amber"
              label="Reserve Word"
              hint="Press enter to apply changes"
              v-model="scope.value"
              dense
              autofocus
              @keyup.space="scope.value = scope.value.slice(0, -1)"
              @keyup.enter="scope.set"
            >
              <template #prepend>
                <q-icon name="mdi-pencil" />
              </template>
            </q-input>
          </q-popup-edit>
        </p>
      </q-item-section>
      <q-item-section side>
        <q-btn
          flat
          @click="remove"
          round
          padding="xs"
          icon="mdi-close"
        />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
    <q-item dense>
      <q-select
        dense
        dark
        options-dense
        borderless
        v-model="definition"
        :options="tokens"
        option-label="name"
        options-selected-class="text-amber-500"
      >
        <!-- <template #option="scope">
        <q-item :="scope.itemProps">
          <q-item-section>
            <q-item-label> {{ scope.opt.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </template> -->
        <template #selected>
          <q-item dense>
            <q-item-section>
              <q-item-label>
                <span :class="{ 'text-muted': !definition }">
                  {{
                    definition
                      ? definition.name || "Empty Token Name"
                      : "No Token Assigned"
                  }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item>
  </q-card>
</template>

<style lang="scss" scoped></style>
