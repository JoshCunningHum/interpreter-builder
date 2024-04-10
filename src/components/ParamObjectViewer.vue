<script setup lang="ts">
import getEnumKeys from "@/utils/getEnumKeys";
import { isStringIn } from "@/utils/isStringIn";
import { get, useArrayFilter } from "@vueuse/core";
import { computed, ref, toRefs } from "vue";
import CMEditorJS from "./CMEditorJS.vue";
import CMType from "./CMType.vue";

export type PropertyType = {
    name: string;
    type: string;
    description: string;
};

export type MethodType = {
    name: string;
    arguments: {
        name: string;
        type: string;
        isOptional?: boolean;
        description: string;
    }[];
    isAsync?: boolean;
    returnType: string;
    description: string;
    example: string;
};

export type InterfaceType = {
    name: string;
    description: string;
    schema: string;
};

const props = withDefaults(
    defineProps<{
        methods?: MethodType[];
        properties?: PropertyType[];
        interfaces?: InterfaceType[];
    }>(),
    {
        methods: () => [],
        properties: () => [],
        interfaces: () => [],
    },
);

const {
    properties: _properties,
    methods: _methods,
    interfaces: _interfaces,
} = toRefs(props);

// Filter
const search = ref("");
const methods = useArrayFilter(_methods, (m) => {
    const s = get(search);
    if (!s) return true;
    return isStringIn(s, [
        m.name,
        m.returnType,
        m.description,
        ...m.arguments.flatMap((a) => [a.description, a.name, a.type]),
    ]);
});
const properties = useArrayFilter(_properties, (m) => {
    const s = get(search);
    if (!s) return true;
    return isStringIn(s, [m.name, m.type, m.description]);
});
const interfaces = useArrayFilter(_interfaces, (i) => {
    const s = get(search);
    if (!s) return true;
    return isStringIn(s, [i.name, i.description, i.schema]);
});

enum Mode {
    Properties,
    Methods,
    Types,
}

const modes = computed(() =>
    getEnumKeys(Mode).filter((m) => {
        if (_methods.value.length === 0 && m === "Methods") return false;
        if (_properties.value.length === 0 && m === "Properties") return false;
        if (_interfaces.value.length === 0 && m === "Types") return false;
        return true;
    }),
);
const mode = ref(Mode[0]);
const modeIcons: Record<string, string> = {
    Methods: "mdi-function-variant",
    Properties: "mdi-format-columns",
    Types: "mdi-code-tags",
};
</script>

<template>
    <q-card flat>
        <q-item>
            <q-item-section>
                <slot name="header">
                    <q-item-label class="text-h6 text-amber">
                        Param Object
                    </q-item-label>
                </slot>
            </q-item-section>
            <q-item-section side>
                <q-input
                    v-model="search"
                    dense
                    placeholder="Search..."
                    hide-bottom-space
                    hide-hint
                    filled
                    clearable
                >
                    <template #append>
                        <q-icon name="mdi-magnify" />
                    </template>
                </q-input>
            </q-item-section>
        </q-item>

        <q-tabs
            inline-label
            v-model="mode"
            dense
            align="left"
            :breakpoint="0"
        >
            <q-tab
                v-for="m in modes"
                :key="m"
                :label="m"
                :name="m"
                :icon="modeIcons[m]"
            >
                <q-badge
                    color="blue"
                    class="ml-2"
                >
                    {{
                        m === Mode[Mode.Methods]
                            ? methods.length
                            : m === Mode[Mode.Properties]
                              ? properties.length
                              : interfaces.length
                    }}
                </q-badge>
            </q-tab>
        </q-tabs>

        <q-tab-panels
            v-model="mode"
            class="bg-neutral-800"
        >
            <!-- Methods -->
            <q-tab-panel
                class="p-0"
                :name="Mode[Mode.Methods]"
                v-if="!!methods && methods.length > 0"
            >
                <q-list separator>
                    <q-item
                        v-for="(meth, i) in methods"
                        :key="i"
                        class="py-3"
                    >
                        <q-item-section>
                            <q-item-label class="text-body1 text-slate-400">
                                <q-badge
                                    color="orange-8"
                                    class="text-body2 text-dark mb-1"
                                    >{{ meth.name }}</q-badge
                                >
                                <br />
                                <div class="font-mono -tracking-widest">
                                    ({{
                                        meth.arguments
                                            .map(
                                                (a) =>
                                                    `${a.name}${a.isOptional ? "?" : ""}: ${a.type}`,
                                            )
                                            .join(", ")
                                    }}) => {{ meth.returnType }}
                                </div>
                            </q-item-label>
                            <q-item-label caption>
                                <span class="text-body2">
                                    {{ meth.description }}</span
                                >
                            </q-item-label>
                            <q-expansion-item
                                dense
                                class="rounded bg-neutral-900"
                            >
                                <template #header>
                                    <div
                                        class="text-hint w-full py-2 font-bold"
                                    >
                                        Argument Details
                                    </div>
                                </template>
                                <q-list
                                    separator
                                    class="px-4"
                                >
                                    <q-item
                                        v-for="(arg, i) in meth.arguments"
                                        :key="i"
                                        class="py-3"
                                    >
                                        <q-item-section>
                                            <q-item-label
                                                class="text-body1 text-slate-400"
                                            >
                                                <q-badge
                                                    v-if="arg.isOptional"
                                                    color="amber-4"
                                                    class="text-body2 text-dark mr-2"
                                                    >Optional</q-badge
                                                >
                                                <q-badge
                                                    color="orange-8"
                                                    class="text-body2 text-dark"
                                                    >{{ arg.name }}</q-badge
                                                >
                                                :
                                                <span
                                                    class="font-mono -tracking-widest"
                                                >
                                                    {{ arg.type }}
                                                </span>
                                            </q-item-label>
                                            <q-item-label caption>
                                                <span class="text-body2">
                                                    {{ arg.description }}</span
                                                >
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-expansion-item>
                            <CMEditorJS
                                disabled
                                class="cm-nolines"
                                v-model="meth.example"
                            />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
            <!-- Properties -->
            <q-tab-panel
                class="p-0"
                :name="Mode[Mode.Properties]"
                v-if="!!properties && properties.length > 0"
            >
                <q-list separator>
                    <q-item
                        v-for="(prop, i) in properties"
                        :key="i"
                        class="py-3"
                    >
                        <q-item-section>
                            <q-item-label class="text-body1 text-slate-400">
                                <q-badge
                                    color="orange-8"
                                    class="text-body2 text-dark"
                                    >{{ prop.name }}</q-badge
                                >
                                : {{ prop.type }}
                            </q-item-label>
                            <q-item-label caption>
                                <span class="text-body2">
                                    {{ prop.description }}</span
                                >
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
            <!-- Interfaces -->
            <q-tab-panel
                :name="Mode[Mode.Types]"
                v-if="!!interfaces && interfaces.length > 0"
                class="p-0"
            >
                <q-list separator>
                    <q-item
                        v-for="(int, i) in interfaces"
                        :key="i"
                        class="py-3"
                    >
                        <q-item-section>
                            <q-item-label class="text-body1 text-slate-400">
                                <q-badge
                                    color="orange-8"
                                    class="text-body2 text-dark"
                                    >{{ int.name }}</q-badge
                                >
                            </q-item-label>
                            <q-item-label caption>
                                <span class="text-body2">
                                    {{ int.description }}</span
                                >
                            </q-item-label>
                            <CMType v-model="int.schema" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>

<style lang="scss" scoped></style>
