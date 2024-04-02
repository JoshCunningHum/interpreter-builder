<script setup lang="ts">
import EmptyContainer from "@/components/EmptyContainer.vue";
import ObjectViewer from "@/components/ObjectViewer/ObjectViewer.vue";
import { type InterpretLog } from "@/logic/interpreter";
import { ref } from "vue";

const { log } = defineProps<{
    log: InterpretLog;
}>();

const list = ["Logs", "Result", "Data", "Globals"];

const mode = ref(list[1]);
</script>

<template>
    <div class="flex flex-col">
        <q-btn-group
            spread
            class="no-shadow"
            square
        >
            <q-btn
                v-for="item in list"
                :key="item"
                class="no-shadow"
                :label="item"
                dense
                :color="mode === item ? 'grey-9' : 'dark'"
                @click="mode = item"
            />
        </q-btn-group>
        <q-tab-panels
            v-model="mode"
            animated
        >
            <q-tab-panel :name="list[0]">
                <ObjectViewer
                    :obj="log.log"
                    v-if="!!log.log && log.log.length > 0"
                />
                <EmptyContainer
                    uppercase
                    v-else
                    >No Logs</EmptyContainer
                >
            </q-tab-panel>
            <q-tab-panel :name="list[1]">
                <ObjectViewer
                    :obj="log.result"
                    v-if="!!log.result"
                />
                <EmptyContainer
                    uppercase
                    v-else
                    >No Result</EmptyContainer
                >
            </q-tab-panel>
            <q-tab-panel :name="list[2]">
                <ObjectViewer
                    :obj="{
                        args: log.args,
                        node: log.node,
                        rule: log.rule,
                    }"
                />
            </q-tab-panel>
            <q-tab-panel :name="list[3]">
                <ObjectViewer :obj="log.global" />
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<style lang="scss" scoped></style>
