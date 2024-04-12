<script setup lang="ts">
import DocsContainer from "@/components/DocsContainer.vue";
import ParamObjectViewer, {
    type InterfaceType,
    type MethodType,
    type PropertyType,
} from "@/components/ParamObjectViewer.vue";
import getEnumKeys from "@/utils/getEnumKeys";
import { computed, ref } from "vue";

const match_props: PropertyType[] = [
    {
        name: "pool",
        type: "ParsePoolItem[]",
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
        type: "ParsePoolItem[]",
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
                type: "ParsePoolItem",
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
                type: "ParsePoolItem",
                description: "The item to check",
            },
        ],
        example: "isNode(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "isMatch",
        arguments: [
            {
                name: "item",
                type: "ParsePoolItem",
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
            "// Checks if the first item is a NumberLiteral Token or BinaryOp Node\nisMatch(pool[0], T.NumberLiteral, N.BinaryOp) ",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "error",
        arguments: [
            {
                name: "message",
                type: "string",
                description: "The error message",
            },
            {
                name: "line",
                type: "number",
                description: "The error line number",
                isOptional: true,
            },
            {
                name: "column",
                type: "number",
                description: "The error column number",
                isOptional: true,
            },
        ],
        description:
            "A function that halts the parser when called to. This also prints an error message on the output.",
        example:
            "error('Missing closing parentheses in the grouping expression')",
        returnType: "void",
    },
    {
        name: "find",
        arguments: [
            {
                name: "pattern",
                type: "(string | number)[]",
                description:
                    "Then pattern to match. You should use the N/T Objects here, or alternatively, just use the string names of the node types instead of using the N object.",
            },
            {
                name: "where",
                type: "\n(items: ParsePoolItem[], start: number) => boolean",
                description:
                    "A callback for further narrowing the matching process. the items argument are the matches made by the pattern while the start is the index of the first element in the items.",
                isOptional: true,
            },
        ],
        description:
            "A function for finding token/node patterns within the pool. You'll have the use the N/T objects for identifying what to match. You can also use strings alternatively for the N (Node) objects. It will return a tuple of number, the index where the pattern started and the length of the pattern (how many matches it got).",
        example: `// This code will find any pattern \n// where a binaryOp token with a '+' as the op within its data \n// is between two number nodes.\nfind([N.Number, T.BinaryOp, N.Number], ([l, o, r]) => {\n\treturn o.data.op === '+'\n})`,
        returnType: "[number, number]",
    },
    {
        name: "findRGX",
        arguments: [
            {
                name: "pattern",
                type: "string",
                description:
                    "The pattern to match. You should use the NX/TX Objects here. Unlike find, you can't use strings for the node names here.",
            },
            {
                name: "where",
                type: "\n(items: ParsePoolItem[], start: number) => boolean",
                description:
                    "A callback for further narrowing the matching process. the items argument are the matches made by the pattern while the start is the index of the first element in the items.",
                isOptional: true,
            },
        ],
        description:
            "Behaves like the find() method but has regex capabilities. You'll have to use template literals to include the Token/Node identifiers (using TX/NX). Once added, you can then use any regex capabilities like the '+' or '*' to catch more complex patterns.",
        example: `// Gets all declaration patterns \n// capable of getting the multiple declarations.
findRGX(\`(\$\{NX.Type\}\$\{NX.Identifier\}(\$\{NX.Identifier\}\$\{NX.Comma\})*\`))`,
        returnType: "[number, number]",
    },
    {
        name: "log",
        arguments: [
            {
                name: "...params",
                description: "The things you want to log",
                type: "any[]",
            },
        ],
        description:
            "A debugging tool. Used to log things in the parser testing",
        example: "log(pool[0])",
        returnType: "void",
    },
    {
        name: "at",
        arguments: [
            {
                name: "index",
                type: "number",
                description: "The index of the item you want to get",
            },
        ],
        description: "An easier way to type the pool[index].",
        example: "at(0) // Same as pool[0]",
        returnType: "ParsePoolItem",
    },
    {
        name: "range",
        arguments: [
            {
                name: "start",
                type: "number",
                description: "The start index of the range. Included.",
            },
            {
                name: "end",
                type: "number",
                description: "The end index of the range. Included.",
            },
        ],
        description: "Acts as pool.slice(start, end) but the end is included.",
        example:
            "// Gets all the matched items in the matcher\n// Except the first and the last\nrange(start + 1, end - 1)",
        returnType: "ParsePoolItem[]",
    },
    {
        name: "splitBy",
        arguments: [
            {
                name: "array",
                type: "ParsePoolItem[]",
                description: "The array you want to split by",
            },
            {
                name: "splitter",
                type: "(item: ParsePoolItem, index: number) => boolean",
                description:
                    "The callback where you have to logically identify if an item should be a point to split",
            },
        ],
        description:
            "A function similar with string.split() however for the pool. It will group the splitted items within array. This can also be used as pool.filter() if you flat the result right after.",
        example: `// Used in a declaration rule.\n// Splits all declarations by commas\nsplitBy(declarations, p => isMatch(p, T.Comma))`,
        returnType: "ParsePoolItem[][]",
    },
];

const map_methods: MethodType[] = [
    {
        name: "isToken",
        arguments: [
            {
                name: "item",
                type: "ParsePoolItem",
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
                type: "ParsePoolItem",
                description: "The item to check",
            },
        ],
        example: "isNode(pool[0])",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "isMatch",
        arguments: [
            {
                name: "item",
                type: "ParsePoolItem",
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
            "// Checks if the first item is a NumberLiteral Token or BinaryOp Node\nisMatch(pool[0], T.NumberLiteral, N.BinaryOp) ",
        returnType: "boolean",
        description: "Checks if a pool item is a node.",
    },
    {
        name: "parse",
        arguments: [
            {
                name: "items",
                type: "ParsePoolItem[]",
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
        returnType: "ParsePoolItem[]",
        description:
            "Re-parses the items passed and returns the result. Used on grouping expressions and other stuff that requires re-parsing of the node items.",
    },
    {
        name: "setKind",
        arguments: [
            {
                name: "kind",
                type: "string",
                description: "The node type you want to assign the result with",
            },
        ],
        example:
            "// Set the kind of node to return as BinaryOp.\nsetKind('BinaryOp') ",
        returnType: "void",
        description:
            "Sets the node type the mapper will return to whatever string you pass in this. If you don't call this, the node type will be the name of the rule.",
    },
    {
        name: "setBody",
        arguments: [
            {
                name: "values",
                type: "ParsePoolItem[]",
                description:
                    "The body/children of the node that you want the node to have.",
            },
        ],
        example:
            "// Set the body/children to all that match found\n// except for first and last.\nsetBody(range(start + 1, end - 1)) ",
        returnType: "void",
        description:
            "Sets the body/children of the result node to whatever you pass in this.",
    },
    {
        name: "setData",
        arguments: [
            {
                name: "value",
                type: "Object",
                description: "The data object you want the node to have.",
            },
        ],
        description:
            "Sets the data object of the current node. You can set this to whatever you want as long as you think that it is important later.",
        example:
            "// Setting the data object of a BinaryOp \nto the second matched item (a binaryOp token in this case)\nsetData({type: at(1).value })",
        returnType: "void",
    },
    {
        name: "setResults",
        arguments: [
            {
                name: "items",
                type: "ASTNode[]",
                description: "The items you want this rule to result to",
            },
        ],
        description:
            "For cases where you want to return multiple nodes, instead of one. You can return nodes in here. Heavily used along with the parse method as that will return a list of nodes too.",
        example:
            "// Special case where you just want to consume nodes\nsetResults([])",
        returnType: "void",
    },
    {
        name: "range",
        arguments: [
            {
                name: "start",
                type: "number",
                description: "The start index of the range. Included.",
            },
            {
                name: "end",
                type: "number",
                description: "The end index of the range. Included.",
            },
        ],
        description: "Acts as pool.slice(start, end) but the end is included.",
        example:
            "// Gets all the matched items in the matcher\n// Except the first and the last\nrange(start + 1, end - 1)",
        returnType: "ParsePoolItem[]",
    },
    {
        name: "at",
        arguments: [
            {
                name: "index",
                type: "number",
                description: "The index of the item you want to get",
            },
        ],
        description: "An easier way to type the pool[index].",
        example: "at(0 // Same as pool[0])",
        returnType: "ParsePoolItem",
    },
    {
        name: "log",
        arguments: [
            {
                name: "...params",
                description: "The things you want to log",
                type: "any[]",
            },
        ],
        description:
            "A debugging tool. Used to log things in the parser testing",
        example: "log(pool[0])",
        returnType: "void",
    },
    {
        name: "splitBy",
        arguments: [
            {
                name: "array",
                type: "ParsePoolItem[]",
                description: "The array you want to split by",
            },
            {
                name: "splitter",
                type: "(item: ParsePoolItem, index: number) => boolean",
                description:
                    "The callback where you have to logically identify if an item should be a point to split",
            },
        ],
        description:
            "A function similar with string.split() however for the pool. It will group the splitted items within array. This can also be used as pool.filter() if you flat the result right after.",
        example: `// Used in a declaration rule.\n// Splits all declarations by commas\nsplitBy(declarations, p => isMatch(p, T.Comma))`,
        returnType: "ParsePoolItem[][]",
    },
    {
        name: "error",
        arguments: [
            {
                name: "message",
                type: "string",
                description: "The error message",
            },
            {
                name: "line",
                type: "number",
                description: "The error line number",
                isOptional: true,
            },
            {
                name: "column",
                type: "number",
                description: "The error column number",
                isOptional: true,
            },
        ],
        description:
            "A function that halts the parser when called to. This also prints an error message on the output.",
        example:
            "error('Missing closing parentheses in the grouping expression')",
        returnType: "void",
    },
];

const parser_types: InterfaceType[] = [
    {
        name: "ParsePoolItem",
        description: "The items inside the pool object.",
        schema: `type ParsePoolItem = ASTNode | Token`,
    },
    {
        name: "ASTNode",
        description: "The node object, the result of the mapper.",
        schema: `interface ASTNode {
    kind: string;
    body: ParsePoolItem[];
    data: Record<string, any>;
}`,
    },
    {
        name: "Token",
        description: "The token object, result of the tokenizer.",
        schema: `interface Token {
    value: string;
    type: number;
}`,
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
            :interfaces="parser_types"
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
