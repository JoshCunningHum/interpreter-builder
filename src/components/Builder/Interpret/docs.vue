<script setup lang="ts">
import DocsContainer from "@/components/DocsContainer.vue";
import ParamObjectViewer, {
    type InterfaceType,
    type MethodType,
    type PropertyType,
} from "@/components/ParamObjectViewer.vue";

const properties: PropertyType[] = [
    {
        name: "glob",
        description:
            "The environment object you made in the Environment Tab. Mutations made in this object persist all through out the Evaluation Process.",
        type: "Object",
    },
    {
        name: "N",
        type: "Record<string, string>",
        description:
            "An object where the field keys are token names and their corresponding values are those exact names. Made just to not type quotation.",
    },
    {
        name: "children",
        type: "ParsePoolItem[]",
        description: "The children of the current node.",
    },
    {
        name: "data",
        type: "Record<string, any>",
        description: "The data of the current node.",
    },
    {
        name: "template",
        type: "RuntimeVal",
        description: "The returned object.",
    },
];

const methods: MethodType[] = [
    {
        name: "setKind",
        arguments: [
            {
                name: "type",
                type: "string",
                description:
                    "The type of what this node evaluation will return",
            },
        ],
        example: `// Sets the returned value of this evaluation into a number
setKind('number')`,
        returnType: "void",
        description:
            "Sets the return type of the RuntimeValue that this node will output",
    },
    {
        name: "setValue",
        arguments: [
            {
                name: "value",
                type: "string | number | undefined",
                description:
                    "The value of what this node evaluation will return",
            },
        ],
        example: `// Sets the returned value of this evaluation
// into whatever the value prop of the data object
setValue(data.value)`,
        returnType: "void",
        description:
            "Sets the returned value of the RuntimeValue that this node will output",
    },
    {
        name: "setAsStatement",
        arguments: [],
        example: `// Good practice to call this immediately on every statement nodes
setAsStatement()`,
        returnType: "void",
        description:
            "On cases where the current node is not an expression, therefore, does not return anything. Call this function to set the returned output of the evaluation to undefined.",
    },
    {
        name: "execute",
        arguments: [
            {
                name: "node",
                type: "ASTNode",
                description: "The node to be executed",
            },
        ],
        isAsync: true,
        example: `// execute the first and second child nodes
const [left, right] = children;
const leftVal = await execute(left);
const rightVal = await execute(right);`,
        description:
            "Evaluates a node asynchronously then outputs the value it returns. Made it like that since the scan method is asynchronous.",
        returnType: "Promise<RuntimeVal>",
    },
    {
        name: "error",
        arguments: [
            {
                name: "msg",
                type: "string",
                description: "The error message to be thrown",
            },
        ],
        description:
            "Used for handling errors. This will log the error on the output and will stop the program.",
        example: "error('You can't divide by 0)",
        returnType: "void",
    },
    {
        name: "log",
        arguments: [
            {
                name: "...items",
                type: "any[]",
                description: "The items to be logged",
            },
        ],
        description:
            "Used for logging. The output will be shown in the testing portion. Will not appear on the output runtime.",
        example: "log(children)",
        returnType: "void",
    },
    {
        name: "is",
        arguments: [
            {
                name: "value",
                type: "RuntimeVal",
                description: "The value to be checked",
            },
            {
                name: "type",
                type: "string",
                description: "The type to be compared",
            },
        ],
        description:
            "Checks the type property of a RuntimeVal object. Will produce an error if the value passed is not a RuntimeVal",
        example: "is(value, 'string')",
        returnType: "boolean",
    },
    {
        name: "awaitAll",
        arguments: [
            {
                name: "array",
                type: "V[]",
                description: "A generic array for the source",
            },
            {
                name: "callback",
                type: "(value: V, i: number, array: V[]) => Promise<T>",
                description:
                    "The callback function that will map each item in the source",
            },
        ],
        description:
            "A function for running an async map synchronously. Uses for loops internally",
        example: `const [first, second] = await awaitAll(children, async (value) => {
    return await execute(value);
})`,
        returnType: "Promise<T[]>",
        isAsync: true,
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
        description:
            "Checks an item if it is a certain type of Node. Most probably there will be no tokens left in this step, so you'll only be using the N object",
    },
    {
        name: "print",
        arguments: [
            {
                name: "msg",
                type: "string",
                description: "The message to print",
            },
        ],
        description: "Prints a message in the output stream",
        example: "print(result.value)",
        returnType: "void",
    },
    {
        name: "scan",
        arguments: [
            {
                name: "msg",
                type: "string",
                description: "The message to print before scanning",
                isOptional: true,
            },
        ],
        description:
            "A method for acquiring user input. An async function that returns whatever the user inputted.",
        example: "const input = await scan();",
        returnType: "Promise<string>",
        isAsync: true,
    },
];

const types: InterfaceType[] = [
    {
        name: "RuntimeVal",
        description:
            "The return type of each Eval Rule, also the return type of the execute function.",
        schema: `interface RuntimeVal {
    type: string;
    value: any;
    error?: string;
}`,
    },
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
</script>

<template>
    <DocsContainer title="Evaluate Nodes">
        <p class="text-body2 font-light">
            The final step, usuallly, of the interpreting,
            <b>the Evaluator</b> or sometimes just called the interpreter or
            something like that. Basically, executes the AST result from the
            parser. It is here that each kind of node have a logic corresponding
            on how to execute it and most of the time, it involves recursion
            because sometimes, these nodes have children that needs to be
            executed in its own process.
        </p>
        <q-separator spaced />
        <q-card class="no-shadow">
            <q-card-section class="text-body2 font-light">
                <p>
                    In here, you'll have to specify all kind of nodes you
                    defined in the parser. Basically all instances of text you
                    passed on the
                    <span class="text-red-400">setKind</span> method back in the
                    parser.
                </p>

                <br />
                <p>
                    Then you'll have to
                    <span class="text-green-4"
                        >specify the logic on how to execute those nodes</span
                    >. You'll be provided with a lot of tools in the
                    <span class="text-orange">Param Object</span>, along with a
                    global runtime object that persist all through out the
                    evaluation process.
                </p>
            </q-card-section>
        </q-card>
        <q-separator spaced />
        <ParamObjectViewer
            :properties="properties"
            :methods="methods"
            :interfaces="types"
        />
    </DocsContainer>
</template>

<style lang="scss" scoped></style>
