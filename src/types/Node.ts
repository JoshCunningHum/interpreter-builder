import type { PrepareParser } from "@/utils/builder/parseinit";
import { ParseMapFunctionBuilder } from "@/utils/builder/parsermap";
import {
    NodeIdentifiers,
    ParseMatchFunctionsBuilder,
    TokenIdentifiers,
} from "@/utils/builder/parsermatch";
import {
    isMatch,
    isNode,
    isToken,
    type ParsePoolItem,
} from "@/utils/builder/parserutils";
import { type Token, type TokenDef } from "./Token";
import { produceAST } from "@/logic/ast";

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
        error: (message: string, line = 0, column = 0) =>
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

    parse: (items: ParsePoolItem[]) => ParsePoolItem[];
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
    } = params;

    const { N } = NodeIdentifiers(pool);

    const utils = ParseMapFunctionBuilder(rule, pool, runtimeLog);

    const parse = (items: ParsePoolItem[]): ParsePoolItem[] => {
        const result = produceAST({
            pool: items,
            T,
            TX,
            history,
            log,
            rules,
            tokenDefs,
            onError,
            onEvalError,
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
