<script setup lang="ts">
import _type_sound from "@/utils/_type_sound";
import isOperaGX from "@/utils/isOperaGX";
import { cpp } from "@codemirror/lang-cpp";
import { ViewUpdate } from "@codemirror/view";
import { materialDark } from "cm6-theme-material-dark";
import { watch } from "vue";
import { Codemirror } from "vue-codemirror";

const code = defineModel<string>({ default: "" });

const emits = defineEmits<{
    (e: "cursorChange", n: number): void;
}>();

const handleUpdate = (update: ViewUpdate) => {
    const ranges = update.state.selection.ranges;
    emits("cursorChange", ranges[0].anchor);
};

watch(code, () => {
    if (isOperaGX()) return;
    _type_sound();
});
</script>

<template>
    <Codemirror
        class="no-shadow cursor-text border-none outline-none"
        v-model="code"
        placeholder="Enter Code"
        :indent-with-tab="true"
        :tab-size="4"
        :extensions="[materialDark, cpp()]"
        @update="handleUpdate"
    >
    </Codemirror>
</template>

<style lang="scss" scoped>
.outline-none {
    .cmeditor {
        outline: none !important;
    }
}
</style>
