import { produceAST } from "@/logic/ast";
import type { PrepareParser } from "@/utils/builder/parseinit";
import { ParseMapFunctionBuilder } from "@/utils/builder/parsermap";
import {
    NodeIdentifiers,
    ParseMatchFunctionsBuilder,
} from "@/utils/builder/parsermatch";
import {
    isMatch,
    isNode,
    isToken,
    type ParsePoolItem,
} from "@/utils/builder/parserutils";
import { type Token } from "./Token";

const DEV = false;

export interface ASTNode {
    kind: string;
    body: ParsePoolItem[];
    data: Record<string, any>;
}

export interface ParseRule {
    id: number;
    name: string;
    match: string;
    mapper: string;
}

// #region Matching

export interface RuleMatchArgs
    extends ReturnType<typeof ParseMatchFunctionsBuilder> {
    pool: ParsePoolItem[];
    T: Record<string, number>;
    N: Record<string, string>;
    TX: Record<string, string>;
    NX: Record<string, string>;

    _rgx: string;

    isToken: typeof isToken;
    isNode: typeof isNode;
    isMatch: typeof isMatch;
    error: (message: string) => void;
}

// Non-Included Utility Functions

export const RuleMatchArgsBuilder = (
    params: ReturnType<typeof PrepareParser>,
    runtimeLog: any[],
): RuleMatchArgs => {
    const { onError, pool, T, TX } = params;

    // Utility Objects
    const { N, NX } = NodeIdentifiers(pool);

    // Utility Functions
    const utils = ParseMatchFunctionsBuilder(pool, runtimeLog);

    return {
        pool,
        T,
        TX,
        N,
        NX,

        isToken,
        isNode,
        isMatch,

        ...utils,

        // Essential Functions
        error: (message: string, line = -1, column = -1) =>
            onError(message, line, column),
    };
};

// #endregion

// #region Mapper

export interface RuleMapperArgs
    extends ReturnType<typeof ParseMapFunctionBuilder> {
    pool: (Token | ASTNode)[];
    start: number;
    end: number;

    T: Record<string, number>;
    N: Record<string, string>;

    isToken: typeof isToken;
    isNode: typeof isNode;
    isMatch: typeof isMatch;

    parse: (
        items: ParsePoolItem[],
        specificRules?: string[],
    ) => ParsePoolItem[];
}

export const RuleMapperArgsBuilder = (
    params: ReturnType<typeof PrepareParser>,
    [start, end]: [number, number],
    rule: ParseRule,
    runtimeLog: any[],
): RuleMapperArgs => {
    const {
        T,
        pool,
        TX,
        history,
        log,
        onError,
        onEvalError,
        rules,
        tokenDefs,
        source,
    } = params;

    const { N } = NodeIdentifiers(pool);

    const utils = ParseMapFunctionBuilder(params, rule, pool, runtimeLog);

    const parse = (
        items: ParsePoolItem[],
        specificRules?: string[],
    ): ParsePoolItem[] => {
        const _rules = specificRules
            ? rules.filter((r) => specificRules.includes(r.name))
            : rules;

        const result = produceAST({
            pool: items,
            T,
            TX,
            history,
            log,
            rules: _rules,
            tokenDefs,
            onError,
            onEvalError: (
                e: Error,
                type: "match" | "map" | "other",
                id?: string,
            ) => {
                onEvalError(e, type, id);
            },
            source,
        }).pool;

        return result;
    };

    return {
        pool,
        start,
        end,
        T,
        N,

        ...utils,

        isMatch,
        isNode,
        isToken,
        parse,
    };
};

export const RunParseMatch = (
    parseRule: ParseRule,
    args: RuleMatchArgs,
    handleError?: (e: any) => any,
): [number, number] | undefined => {
    try {
        return eval(parseRule.match)(args) as [number, number];
    } catch (e) {
        if (handleError) handleError(e);
    }
};

export const RunParseMapper = (
    parseRule: ParseRule,
    args: RuleMapperArgs,
    handleError?: (e: any) => any,
): void => {
    try {
        eval(parseRule.mapper)(args);
    } catch (e) {
        if (handleError) handleError(e);
    }
};

// #endregion
