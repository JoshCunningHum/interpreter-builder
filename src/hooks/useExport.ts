import { useInterpreterStore } from "@/stores/interpreter";
import { useParserStore } from "@/stores/parser";
import { useTokenStore } from "@/stores/token";
import { saveAsFile } from "@/utils/saveAsFile";

export type IOCategories =
    | "ReserveWords"
    | "TokenDefinitions"
    | "ParseRules"
    | "EvalDefs";

// Can be used to export interpreter specs individually or as a whole
export const useExport = (category: IOCategories) => {
    const { exludedTokens, parseRules } = useParserStore();
    const { tokens, reserves } = useTokenStore();
    const { evalDefs } = useInterpreterStore();

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
    }
};
