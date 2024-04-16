<script setup lang="ts">
import ProcessTabPanel from "@/components/ProcessTabPanel.vue";
import ProcessTabTitle from "@/components/ProcessTabTitle.vue";
import { useTokenStore } from "@/stores/token";
import genidnum from "@/utils/genidnum";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onActivated } from "vue";
import Item from "./Item.vue";
import Docs from "./docs.vue";

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
        line: -1,
        col: -1,
    });
};

onActivated(() => emit("initializeAddHook", add));
</script>

<template>
    <ProcessTabPanel>
        <ProcessTabTitle
            title="Define Reserve Words"
            description="Completely optional. Just an easier way to define reserve
            words."
        >
            <template #docs>
                <Docs />
            </template>
        </ProcessTabTitle>
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
    </ProcessTabPanel>
</template>

<style lang="scss" scoped></style>
