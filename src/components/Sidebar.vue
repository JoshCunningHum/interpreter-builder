<script setup lang="ts">
import { ref } from "vue";
import { useUiStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { get, onClickOutside, set } from "@vueuse/core";
import { QDrawer } from "quasar";

// Always open
const open = true;

const isMini = ref(false);
const uiStore = useUiStore();

const { menu } = storeToRefs(uiStore);

// Menus
const menus = [
  {
    label: "Code",
    icon: "mdi-file",
  },
  {
    label: "Process",
    icon: "mdi-tune",
  },
  {
    label: "Builder",
    icon: "mdi-tools",
  },
  {
    label: 'Settings',
    icon: "mdi-cog"
  }
];

const click = (i: number) => {
    // if current menu is the same as the current index, then toggle the isMini
    if(i === get(menu)) set(isMini, !get(isMini));
    else {
        set(isMini, false);
        set(menu, i);
    }
}

// on click outside
const drawer = ref<QDrawer>();
onClickOutside(drawer, () => {
    set(isMini, true)
});

</script>

<template>
  <q-drawer
    persistent
    :breakpoint="0"
    no-mini-animation
    ref="drawer"
    :mini="isMini"
    show-if-above
    v-model="open"
    side="left"
    bordered
    :width="150"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item
          v-for="(m, i) in menus"
          :key="m.label"
          clickable
          v-ripple
          @click="click(i)"
          :focused="i === menu"
        >
          <q-item-section avatar><q-icon :name="m.icon" /></q-item-section>
          <q-item-section>{{ m.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<style lang="scss" scoped></style>
