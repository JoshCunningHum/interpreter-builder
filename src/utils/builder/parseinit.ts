import type { ParseProcessLog } from "@/stores/parser";
import type { ParseRule } from "@/types/Node";
import type { Token, TokenDef } from "@/types/Token";
import { TokenIdentifiers } from "./parsermatch";
import type { ParsePoolItem } from "./parserutils";

export interface PrepareParserOptions {
    onError: (msg: string, line: number, column: number, id?: string) => void;
    onEvalError: (
        e: Error,
        type: "match" | "map" | "other",
        id?: string,
    ) => void;
    tokens: Token[];
    rules: ParseRule[];
    tokenDefs: TokenDef[];
    excludeTokens: number[];
    source: string,
    // Logging
    log?: boolean;
}

export const PrepareParser = ({
    tokens,
    excludeTokens: exclude,
    rules,
    tokenDefs,
    log,
    onError,
    onEvalError,
    source,
}: PrepareParserOptions) => {
    const history: ParseProcessLog[] = [];

    // Sanitize Tokens Here
    const pool = tokens.filter(
        (t) => !exclude.some((exc) => exc === t.type),
    ) as ParsePoolItem[];

    // Prepare all Token Identifiers
    const { T, TX } = TokenIdentifiers(tokenDefs);

    return {
        pool,
        rules: [...rules].reverse(),
        tokenDefs,
        log,
        history,
        // Prepared Identifiers
        T,
        TX,
        // Callbacks
        onError,
        onEvalError,
        source
    };
};
