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
    <DocsContainer title="Define Tokens">
        <p class="text-body2 font-light">
            The first step of creating the interpreter, <b>the lexer</b> . The
            goal of the lexer is to turn your code; an array of characters, into
            an array of tokens. Specifically objects containing information on
            what kind of 'token' is a group of characters or a single character
            signifies.
        </p>
        <q-separator spaced />
        <q-card class="no-shadow">
            <q-card-section class="text-body2 font-light">
                <p>
                    In here, you have to create a token definition that consists
                    of a name and a function definition that accepts the
                    <span class="text-amber">param object</span> (See below)
                    then returns a number.
                </p>
            </q-card-section>
            <q-item
                dense
                class="text-body2 pb-1 pt-0 font-light"
            >
                <q-item-section>
                    <q-item-label>
                        <span class="text-emerald-400"
                            >The function logic should be a way to detect if the
                            current pointer of the lexer represents the current
                            token definition.</span
                        >
                        If it is a match, then return the length characters, If
                        not, then you have to return <kbd>-1</kbd>, although you
                        can also not return anything but its better if you do
                        <kbd>-1</kbd> .</q-item-label
                    >
                </q-item-section>
            </q-item>
            <q-item class="pb-3 pt-4">
                <q-item-section side>
                    <q-icon
                        name="mdi-alert"
                        class="text-red"
                    ></q-icon>
                </q-item-section>
                <q-item-section>
                    <q-item-label> Warning </q-item-label>
                    <q-item-label caption
                        >Do not return <kbd>0</kbd> as it will result into an
                        infinite loop .
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card>

        <q-separator spaced />

        <ParamObjectViewer :properties="properties" />
    </DocsContainer>
</template>

<style lang="scss" scoped></style>
