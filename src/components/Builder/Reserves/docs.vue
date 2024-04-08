<script setup lang="ts">
import DocsContainer from "@/components/DocsContainer.vue";
import ParamObjectViewer, {
    type PropertyType,
} from "@/components/ParamObjectViewer.vue";

const properties: PropertyType[] = [
    {
        name: "slice",
        type: "string",
        description:
            "Contains the rest of the string starting from the lexer pointer",
    },
    {
        name: "whole",
        type: "string",
        description: "Contains the whole source code",
    },
];
</script>

<template>
    <DocsContainer title="Define Reserve Words">
        <p class="text-body2 font-light">
            A part of the <b>Lexer</b>, where instead of creating logic for
            detecting a certain string, you can just define those in here.
            Although you don't have to do this, this is a more convenient way to
            define reserved keywords.
        </p>
        <q-separator spaced />
        <q-card class="no-shadow">
            <q-card-section class="text-body2 font-light">
                <p>
                    It is quite straightforward, add a definition. Set the word.
                    Set the token type assigned to that word.
                </p>
            </q-card-section>
            <q-item class="pb-3">
                <q-item-section side>
                    <q-icon
                        name="mdi-alert-circle"
                        class="text-orange"
                    ></q-icon>
                </q-item-section>
                <q-item-section>
                    <q-item-label> Note </q-item-label>
                    <q-item-label caption
                        >A definition with no word or no token assigned will
                        definitely not work and not will be included in the
                        whole interpreter runtime.
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card>
    </DocsContainer>
</template>

<style lang="scss" scoped></style>
