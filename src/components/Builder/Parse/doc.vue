<script setup lang="ts">
import DocsContainer from "@/components/DocsContainer.vue";
import ParamObjectViewer, {
    type MethodType,
    type PropertyType,
} from "@/components/ParamObjectViewer.vue";
import getEnumKeys from "@/utils/getEnumKeys";
import { computed, ref } from "vue";

const match_props: PropertyType[] = [
    {
        name: "pool",
        type: "(ASTNode | Token)[]",
        description:
            "Contains the current pool, initially the array of tokens from the tokenizer",
    },
    {
        name: "T",
        type: "Record<string, number>",
        description:
            "An object where the fields keys are token names and their corresponding values are the id's of those tokens.",
    },
    {
        name: "TX",
        type: "Record<string, string>",
        description: "Similar as T, but is mapped for the findRGX method",
    },
    {
        name: "N",
        type: "Record<string, string>",
        description:
            "An object where the fields keys are token names and their corresponding values are those exact names. Made just to not type quotation.",
    },
    {
        name: "NX",
        type: "Record<string, string>",
        description: "Same as N, but is mapped for the findRGX method",
    },
    {
        name: "_rgx",
        type: "string",
        description:
            "The rgx-ed version of the pool. Used by the findRGX method.",
    },
];

const map_props: PropertyType[] = [
    {
        name: "pool",
        type: "(ASTNode | Token)[]",
        description:
            "Contains the current pool, initially the array of tokens from the tokenizer",
    },
    {
        name: "start",
        type: "number",
        description:
            "The index of the start of the group of tokens that the Matcher captured.",
    },
    {
        name: "end",
        type: "number",
        description:
            "The index of the end of the group of tokens that the Matcher captured. The item in this index is not really included in the captured, its just the result index of the sum of the tuple you returned in the Matcher.",
    },
    {
        name: "T",
        type: "Record<string, number>",
        description:
            "An object where the fields keys are token names and their corresponding values are the id's of those tokens.",
    },
    {
        name: "N",
        type: "Record<string, string>",
        description:
            "An object where the fields keys are token names and their corresponding values are those exact names. Made just to not type qoutation.",
    },
    {
        name: "result",
        type: "ASTNode[]",
        description:
            "The container of what the mapper's output. There are helper methods for adding items in here but you can also just manually push items here however you have to put the right items else the progam will break.",
    },
];

const match_methods: MethodType[] = [
    {
        name: "isToken",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
        ],
        example: "isToken(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a token.",
    },
    {
        name: "isNode",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
        ],
        example: "isToken(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "isMatch",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
            {
                name: "...types",
                type: "(string | number)[]",
                description:
                    "A varags where you can pass N or T members to check",
            },
        ],
        example:
            "// Checks if the first item is a NumberLiteral Token or BinaryOp Node\nisToken(pool[0], T.NumberLiteral, N.BinaryOp) ",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
];

const map_methods: MethodType[] = [
    {
        name: "isToken",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
        ],
        example: "isToken(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a token.",
    },
    {
        name: "isNode",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
        ],
        example: "isToken(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "isMatch",
        arguments: [
            {
                name: "item",
                type: "(ASTNode | Token)",
                description: "The item to check",
            },
            {
                name: "...types",
                type: "(string | number)[]",
                description:
                    "A varags where you can pass N or T members to check",
            },
        ],
        example:
            "// Checks if the first item is a NumberLiteral Token or BinaryOp Node\nisToken(pool[0], T.NumberLiteral, N.BinaryOp) ",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "parse",
        arguments: [
            {
                name: "items",
                type: "(ASTNode | Token)[]",
                description: "The items to check",
            },
            {
                name: "specificRules",
                type: "string[]",
                description:
                    "If you want to specify which rules are only used for parsing for better performance",
                isOptional: true,
            },
        ],
        example:
            "// Re-parse the whole matched result except for the first and last items.\nparse(range(start + 1, end - 2)) ",
        returnType: "(ASTNode | Token)[]",
        description:
            "Re-parses the items passed and returns the result. Used on grouping expressions and other stuff that requires re-parsing of the node items.",
    },
];

enum Mode {
    Matcher,
    Mapper,
}

const modes = getEnumKeys(Mode);
const mode = ref(Mode[Mode.Matcher]);

// Props
const properties = computed(() =>
    mode.value === "Matcher" ? match_props : map_props,
);

const methods = computed(() =>
    mode.value === "Matcher" ? match_methods : map_methods,
);
</script>

<template>
    <DocsContainer title="Parsing Rules">
        <p class="text-body2 font-light">
            The second step of the interpreter, <b>the Parser</b>, the most
            complex part of the interpreter. It is here that you take the array
            of tokens from the lexer and turn it into an
            <b>Abstract Syntax Tree</b> (AST). A lot of recursions.
        </p>
        <q-separator spaced />
        <q-card class="no-shadow">
            <q-card-section class="text-body2 font-light">
                <p>
                    In here, in each parse rule, there are 2 editors;
                    <span class="text-orange">Matcher</span> and the
                    <span class="text-amber">Mapper</span>.

                    <br />
                    <br />

                    The goal of the <span class="text-orange">Matcher</span> is
                    to get the group of tokens that signifies the rule,
                    specifically you
                    <span class="text-green-4">return a tuple of numbers</span>,
                    the first being the index of where the start of the group of
                    tokens and the second is the number of tokens/nodes you'll
                    capture. There are helper functions in the
                    <span class="text-orange">Param Object</span> in order to
                    help you capture these patterns.

                    <br />
                    <br />

                    The <span class="text-amber">Mapper</span> then does
                    "things" to what you have captured in the
                    <span class="text-orange">Matcher</span> in order to create
                    a node/s as the AST. There is nothing to return here
                    however, you have to provide values on the functions
                    provided in its own
                    <span class="text-orange">Param Object</span>. Specifically,
                    <span class="text-red-400">setKind</span>,
                    <span class="text-red-400">setBody</span>,
                    <span class="text-red-400">setData</span>. Please refer to
                    the <span class="text-orange">Param Object</span> below for
                    information.
                </p>
            </q-card-section>
        </q-card>
        <q-separator spaced />
        <q-card class="no-shadow">
            <q-card-section class="text-body2 font-light">
                <p>
                    Before parsing, you have the option to
                    <span class="text-green-4"
                        >filter the pool with tokens that should be
                        ignored</span
                    >. These could be ignorables like whitespace tokens or
                    comment tokens. You can specify those in the
                    <span class="text-orange">Sanitize Tokens</span> section in
                    the top-level of this tab.
                </p>
            </q-card-section>
        </q-card>

        <q-separator spaced />

        <ParamObjectViewer
            :properties="properties"
            :methods="methods"
        >
            <template #header>
                <q-tabs
                    v-model="mode"
                    align="left"
                    dense
                    inline-label
                    :breakpoint="0"
                    active-bg-color="amber-9"
                    indicator-color="transparent"
                    class="rounded-sm"
                >
                    <q-tab
                        v-for="m in modes"
                        :key="m"
                        :label="m"
                        :name="m"
                    />
                </q-tabs>
            </template>
        </ParamObjectViewer>
    </DocsContainer>
</template>

<style lang="scss" scoped></style>
