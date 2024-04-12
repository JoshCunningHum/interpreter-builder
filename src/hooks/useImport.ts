import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import type { ParseRule } from "@/types/Node";
import type { ReservedWord, TokenDef } from "@/types/Token";
import { get, isObject, set, useFileDialog } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import type { IOCategories } from "./useExport";
import { useInterpreterStore } from "@/stores/interpreter";
import type { EvalDef } from "@/types/Evals";
import { useGlobalStore } from "@/stores/global";

const { open, reset, onChange } = useFileDialog({
    accept: "application/JSON",
});
const category = ref<IOCategories>();

export const useImport = (type: IOCategories | "all") => {
    set(category, type);
    open();
};

onChange(async (files) => {
    if (!files || !category.value) return;
    const ctgry = category.value;
    const [file] = files;

    const data = await file.text();

    try {
        const parsed = JSON.parse(data);
        imp(parsed, ctgry);
    } catch {
        alert("Failed importing file");
    }
});

// Can be used to export interpreter specs individually or as a whole
export const imp = (data: unknown, type: IOCategories | "all"): boolean => {
    if (!isObject(data)) return false;

    const tokenStore = useTokenStore();
    const parserStore = useParserStore();
    const interpreterStore = useInterpreterStore();
    const globalStore = useGlobalStore();

    const { reserves, tokens } = storeToRefs(tokenStore);
    const { exludedTokens, parseRules } = storeToRefs(parserStore);
    const { evalDefs } = storeToRefs(interpreterStore);
    const { glob } = storeToRefs(globalStore);

    switch (type) {
        case "all":
        case "ParseRules":
            if (!("exludedTokens" in data && "parseRules" in data))
                return false;
            if (!Array.isArray(data.exludedTokens)) return false;
            if (!Array.isArray(data.parseRules)) return false;
            console.log(data);

            // Import parse rules
            data.parseRules.forEach((r) => {
                if (!isObject(r)) return;
                if (
                    !("id" in r && "name" in r && "match" in r && "mapper" in r)
                )
                    return;
                if (!Number.isInteger(r.id)) return;
                if (!(typeof r.name === "string")) return;
                if (!(typeof r.match === "string")) return;
                if (!(typeof r.mapper === "string")) return;
                if (get(parseRules).some((_) => _.id === r.id)) return;
                get(parseRules).push(r as ParseRule);
            });

            // Import Exluded Tokens
            data.exludedTokens.forEach((t) => {
                if (typeof t !== "number") return;
                if (get(exludedTokens).some((_) => _ === t)) return;
                get(exludedTokens).push(t);
            });

            if (type !== "all") break;
        case "ReserveWords":
            if (!("reserves" in data)) return false;
            if (!Array.isArray(data.reserves)) return false;

            // Import Reserve Words
            data.reserves.forEach((r) => {
                if (!isObject(r)) return;
                // Check if r has the id: number, value: string, type: number properties
                if (!("id" in r && "value" in r && "type" in r)) return;
                if (!Number.isInteger(r.id)) return;
                if (!(typeof r.value === "string")) return;
                if (!Number.isInteger(r.type)) return;
                if (get(reserves).some((_) => _.id === r.id)) return;
                get(reserves).push(r as ReservedWord);
            });

            if (type !== "all") break;
        case "TokenDefinitions":
            if (!("tokens" in data)) return false;
            if (!Array.isArray(data.tokens)) return false;

            // Import Token Definitions
            data.tokens.forEach((t) => {
                if (!isObject(t)) return;
                // Check if t has the id: number, name: string, match: string properties
                if (!("id" in t && "name" in t && "match" in t)) return;
                if (!Number.isInteger(t.id)) return;
                if (!(typeof t.name === "string")) return;
                if (!(typeof t.match === "string")) return;
                if (get(tokens).some((_) => _.id === t.id)) return;
                get(tokens).push(t as TokenDef);
            });

            if (type !== "all") break;
        case "EvalDefs":
            if (!("evalDefs" in data)) return false;
            if (!Array.isArray(data.evalDefs)) return false;

            // Import Eval Definitions
            data.evalDefs.forEach((d) => {
                if (!isObject(d)) return;

                if (!("id" in d && "kind" in d && "logic" in d)) return;
                if (!Number.isInteger(d.id)) return;
                if (!(typeof d.kind === "string")) return;
                if (!(typeof d.logic === "string")) return;
                if (get(evalDefs).some((_) => _.id === d.id)) return;
                get(evalDefs).push(d as EvalDef);
            });

            if (type !== "all") break;
        case "Globals":
            if (!("glob" in data)) return false;
            if (typeof data.glob !== "string") return false;

            // Import the global object
            glob.value = data.glob;
            if (type !== "all") break;
    }

    return true;
};
