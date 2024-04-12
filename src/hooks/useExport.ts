import { useGlobalStore } from "@/stores/global";
import { useInterpreterStore } from "@/stores/interpreter";
import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import { saveAsFile } from "@/utils/saveAsFile";

export type IOCategories =
    | "ReserveWords"
    | "TokenDefinitions"
    | "ParseRules"
    | "Globals"
    | "EvalDefs";

// Can be used to export interpreter specs individually or as a whole
export const useExport = (category: IOCategories) => {
    const { exludedTokens, parseRules } = useParserStore();
    const { tokens, reserves } = useTokenStore();
    const { evalDefs } = useInterpreterStore();
    const { glob } = useGlobalStore();

    switch (category) {
        case "ParseRules":
            saveAsFile(
                JSON.stringify({ exludedTokens, parseRules }),
                "ParseRules.json",
            );
            break;
        case "ReserveWords":
            saveAsFile(JSON.stringify({ reserves }), "ReserveWords.json");
            break;
        case "TokenDefinitions":
            saveAsFile(JSON.stringify({ tokens }), "TokenDefinitions.json");
            break;
        case "EvalDefs":
            saveAsFile(JSON.stringify({ evalDefs }), "EvalDefs.json");
            break;
        case "Globals":
            saveAsFile(JSON.stringify({ glob }), "Globals.json");
            break;
    }
};

export const useExportAll = (name = "Interpreter.json") => {
    const { exludedTokens, parseRules } = useParserStore();
    const { tokens, reserves } = useTokenStore();
    const { glob } = useGlobalStore();
    const { evalDefs } = useInterpreterStore();

    const data = {
        tokens,
        reserves,
        exludedTokens,
        parseRules,
        evalDefs,
        glob,
    };

    saveAsFile(JSON.stringify(data), name);
};
