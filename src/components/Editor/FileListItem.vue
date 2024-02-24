<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import type { CodeFile } from "@/types/CodeFile";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { QPopupEdit } from "quasar";
import { ref } from "vue";

const prop = defineProps<{
  f: CodeFile;
}>();


const ideStore = useIdeStore();
const { files, current } = storeToRefs(ideStore);

const EditPopupDisabled = ref(true);
const EditPopup = ref<QPopupEdit>();

// Select File
const select = () => {
    set(current, prop.f);
}

// Context Menu Operations
const remove = () => {
    const index = files.value.findIndex(f => f.name === prop.f.name);
    if(index > -1) files.value.splice(index, 1);
}
const exp = () => {

}
const rename = () => {
    if(!EditPopup.value) return;
    set(EditPopupDisabled, false);
    setTimeout(EditPopup.value.show, 10)
}

</script>

<template>
  <q-item
    dense
    clickable
    :key="f.name"
    class="group"
    :focused="current?.name === f.name"
    @click="select"
  >
    <q-item-section side>
      <q-icon
        name="mdi-language-c"
        size="xs"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <p
          class=""
          :class="[!f.name && 'text-muted']"
        >
          {{ f.name || "Assign a token name" }}
          <q-popup-edit
            ref="EditPopup"
            dense
            class="no-shadow"
            square
            @hide="() => EditPopupDisabled = true"
            :disable="EditPopupDisabled"
            v-model="f.name"
            #default="scope"
          >
            <q-input
              color="amber"
              label="File name"
              hint="Press enter to apply changes"
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            >
              <template #prepend>
                <q-icon name="mdi-pencil" />
              </template>
            </q-input>
          </q-popup-edit>
        </p>
      </q-item-label>
    </q-item-section>
    <q-menu context-menu class="no-shadow">
        <q-list dense bordered>

            <q-item clickable @click="rename" v-close-popup>
                <q-item-section side> <q-icon name="mdi-pencil" size="xs" /> </q-item-section>
                <q-item-section>Rename</q-item-section>
            </q-item>

            <q-item clickable @click="exp" v-close-popup>
                <q-item-section side> <q-icon name="mdi-export" size="xs" /> </q-item-section>
                <q-item-section>Export</q-item-section>
            </q-item>

            <q-item clickable @click="remove" v-close-popup>
                <q-item-section side> <q-icon color="red" name="mdi-delete" size="xs" /> </q-item-section>
                <q-item-section class="text-red">Delete</q-item-section>
            </q-item>

        </q-list>
    </q-menu>
    <!-- <q-item-section side>
      <q-icon
        @click="remove"
        class="opacity-0 group-hover:opacity-100"
        name="mdi-delete"
        size="xs"
      />
    </q-item-section> -->
  </q-item>
</template>

<style lang="scss" scoped></style>
