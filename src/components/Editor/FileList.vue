<script setup lang="ts">
import { useIdeStore } from "@/stores/ide";
import { alphabeticalComparator } from "@/utils/comparators";
import getDuplicateWithIncrement from "@/utils/getDuplicateWithIncrement";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import FileListItem from "./FileListItem.vue";

const ideStore = useIdeStore();
const { files } = storeToRefs(ideStore);
const files_sorted = computed(() =>
  [...get(files)].sort((a, b) => alphabeticalComparator()(a.name, b.name)),
);

const create = () => {
  // Check if there is a new file, add increments till you find
  const filename = getDuplicateWithIncrement(
    get(files).map((f) => f.name),
    "New File",
  );

  get(files).push({
    name: filename,
    data: "// Hello world",
  });
};

const imp = () => {};

const exp = () => {};

const remove = (index: number) => {
  get(files).splice(index, 1);
};
</script>

<template>
  <div class="min-w-48 h-screen relative">
    <q-scroll-area class="bg-primary w-full h-full">
      <q-list dark>
        <q-item>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-hint">Files</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn-dropdown
              dropdown-icon="mdi-dots-vertical "
              padding="xs"
              rounded
              menu-anchor="top end"
              menu-self="top left"
              :menu-offset="[17, 0]"
              no-icon-animation
            >
              <template #default class="no-shadow">
                <q-list
                  class="min-w-40 no-shadow bg-primary"
                  dense
                  :rounded="false"
                >
                  <q-item
                    clickable
                    @click="create"
                  >
                    <q-item-section side>
                      <q-icon
                        name="mdi-file"
                        size="xs"
                      />
                    </q-item-section>
                    <q-item-section
                      ><q-item-label> New File... </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="imp"
                  >
                    <q-item-section side>
                      <q-icon
                        name="mdi-import"
                        size="xs"
                      />
                    </q-item-section>
                    <q-item-section
                      ><q-item-label> Import Files... </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section side>
                      <q-icon
                        name="mdi-export"
                        size="xs"
                      />
                    </q-item-section>
                    <q-item-section
                      ><q-item-label> Export Files... </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>

        <file-list-item
          v-for="f in files_sorted"
          :f="f"
          :key="f.name"
        />
      </q-list>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped></style>
