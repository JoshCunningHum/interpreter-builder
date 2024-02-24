<script setup lang="ts">
import { useTokenStore } from '@/stores/token';
import genidnum from '@/utils/genidnum';
import { get } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import Item from './Item.vue'

const emit = defineEmits<{
  (e: 'initializeAddHook', func: () => void ) : void
}>();

const tokenStore = useTokenStore();
const { reserves } = storeToRefs(tokenStore);

onMounted(() => {
    emit('initializeAddHook', () => {
        get(reserves).push({
            id: genidnum(),
            type: -1,
            value: ''
        })
    })
})

</script>

<template>
    <div v-if="reserves.length === 0" class="flex flex-grow justify-center items-center">
        <div class="text-h5 text-muted select-none">No Assigned Reserve Words</div>
    </div>
    <q-scroll-area v-else>
        <div class="flex flex-wrap gap-2">
            <Item v-for="(r, i) in reserves" :key="r.id" :reserve="r" :index="i" />
        </div>
    </q-scroll-area>
</template>

<style lang="scss" scoped>

</style>