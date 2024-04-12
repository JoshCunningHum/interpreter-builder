<script setup lang="ts">
import { useImport } from "@/hooks/useImport";
import { useExportAll } from "@/hooks/useExport";
import { ref } from "vue";
import { useTokenStore } from "@/stores/token";
import { useParserStore } from "@/stores/parser";
import { useInterpreterStore } from "@/stores/interpreter";
import { useGlobalStore } from "@/stores/global";

// Stores
const tokenStore = useTokenStore();
const parserStore = useParserStore();
const interpreterStore = useInterpreterStore();
const globalStore = useGlobalStore();

// Export / Import
const showexportname = ref(false);
const exportname = ref("");

const exp = () => {
    const name = exportname.value ? `${exportname.value}.json` : undefined;
    useExportAll(name);
    showexportname.value = false;
};

// Reset
const showreset = ref(false);
const reset = () => {
    // Tokens
    tokenStore.reserves.splice(0);
    tokenStore.tokens.splice(0);

    // Parser
    parserStore.exludedTokens.splice(0);
    parserStore.parseRules.splice(0);

    // Interpreter
    interpreterStore.evalDefs.splice(0);
    globalStore.glob = "";

    showreset.value = false;
};
</script>

<template>
    <q-list
        bordered
        class="mx-3 rounded"
    >
        <q-item-label header>Builder</q-item-label>

        <q-item clickable>
            <q-item-section>
                <q-item-label>Data</q-item-label>
                <q-item-label caption>
                    Import/Export/Reset all the data in the builder
                </q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-btn-group
                    square
                    class="gap-2"
                    dense
                >
                    <q-btn
                        icon="mdi-import"
                        label="Import"
                        @click="useImport('all')"
                    />
                    <q-btn
                        icon="mdi-export"
                        label="Export"
                        @click="showexportname = true"
                    />
                    <q-btn
                        icon="mdi-close"
                        color="red"
                        @click="showreset = true"
                        >Reset</q-btn
                    >
                </q-btn-group>
            </q-item-section>
        </q-item>

        <!-- Export Dialog -->
        <q-dialog v-model="showexportname">
            <q-card>
                <q-card-section class="text-h6">Input filename</q-card-section>
                <q-card-section>
                    <q-input
                        dense
                        autofocus
                        @keyup.enter="exp"
                        v-model="exportname"
                        placeholder="Interpreter"
                        suffix=".json"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Cancel"
                        @click="showexportname = false"
                    />
                    <q-btn
                        flat
                        label="Export"
                        @click="exp"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Reset Dialog -->
        <q-dialog v-model="showreset">
            <q-card>
                <q-card-section class="text-h6"
                    >Are you sure you want to reset?</q-card-section
                >
                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Cancel"
                        @click="showreset = false"
                    />
                    <q-btn
                        color="red"
                        flat
                        label="Reset"
                        @click="reset"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-list>
</template>

<style lang="scss" scoped></style>
