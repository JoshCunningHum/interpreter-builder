<script setup lang="ts">
import { get, useArrayReduce } from '@vueuse/core';
import { computed, toRefs } from 'vue';


const props = defineProps<{
    cursor: number;
    source: string;
}>();

const { cursor, source } = toRefs(props);

const lines = computed(() => get(source).split('\n'));
const line = useArrayReduce(lines, ([ln, total], l, i) =>  [cursor.value >= total ? i : ln, total + l.length + 1], [0, 0])
const col = useArrayReduce(lines, ([ln, total], l, i) =>  [cursor.value >= total ? cursor.value - total : ln, total + l.length + 1], [0, 0])

</script>

<template>
    <div class="bg-primary flex justify-between p-2 text-hint">
      <div></div>
      <div class="flex gap-4">
        <span>
            Ln {{ line[0] + 1 }}, Col {{ col[0] }}
        </span>
        <span>
            Space : 4
        </span>
      </div>
    </div>
</template>

<style lang="scss" scoped>

</style>