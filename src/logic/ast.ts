import type { ParseProcessLog } from "@/stores/parser";
import {
    RuleMapperArgsBuilder,
    RuleMatchArgsBuilder,
    RunParseMapper,
    RunParseMatch,
    type ASTNode,
    type ParseRule,
} from "@/types/Node";
import { type Token, type TokenDef } from "@/types/Token";
import type { PrepareParser } from "@/utils/builder/parseinit";
import { isToken, type ParsePoolItem } from "@/utils/builder/parserutils";
import genid from "@/utils/genid";

const DEV = false;

// const RunRule = (
//     pool: ParsePoolItem[],
//     rules: ParseRule[],
//     tokenDefs: TokenDef[],
//     ruleIndex = 0,
//     Logging: boolean = false,
//     Logs: ParseProcessLog[] = [],
//     MAX_RECURSION_GUARD = 100,
// ): {
//     pool: (Token | ASTNode)[];
//     history?: ParseProcessLog[];
//     error?: string;
// } => {
//     // Base Case
//     if (ruleIndex > rules.length - 1 || MAX_RECURSION_GUARD <= 0)
//         return { pool, history: Logs };

//     const rule = rules[rules.length - (ruleIndex + 1)];
//     if (DEV)
//         console.log(
//             `%cStarting iteration for %c<${rule.name}>`,
//             "color:cyan",
//             "color:teal",
//         );

//     // Run Matching
//     const matches: [number, number][] = [];

//     let MAX_LOOP = pool.length * 2;
//     while (MAX_LOOP--) {
//         const start = matches.reduce(
//             (max, [s, n]) => (max > s + n ? max : s + n),
//             0,
//         );

//         if (start > pool.length - 1) break;

//         const args = RuleMatchArgsBuilder(pool.slice(start), tokenDefs, rules);

//         const result = RunParseMatch(rule, args, (e) => {
//             console.error(`Error on parsing rule: ${rule.name}`, e);
//         });

//         if (DEV) console.log(rule.name, start, args, result, matches);

//         if (((r: any): r is [number, number] => Array.isArray(r))(result)) {
//             const [_start, _n] = result;
//             if (_start === -1) break;
//             matches.push([_start + start, _n]);
//         } else if (result instanceof Error) {
//             return { pool, error: result.message };
//         } else if (result === undefined) break;
//     }

//     if (matches.length && DEV) console.log(matches);
//     else if (DEV)
//         console.log("%cNo Matches in this iteration", "color:crimson");

//     // Run Mapper
//     matches.reduce((offset, [s, l]) => {
//         const start = offset + s;

//         // Generate RuleMapperArgs
//         const args = RuleMapperArgsBuilder(
//             pool,
//             [start, start + l],
//             rule,
//             tokenDefs,
//         );

//         // Pass it to the mapper
//         const error = RunParseMapper(rule, args, (e) =>
//             console.error(`Error on mapping: ${rule.name}`, e),
//         );

//         const generatedNode = args.data();

//         pool.splice(start, l, generatedNode);

//         return -(l - 1);
//     }, 0);

//     if (Logging) {
//         Logs.push({
//             id: genid(16),
//             rule,
//             ruleIndex,
//             matches,
//             pool: structuredClone(pool),
//         });
//     }

//     if (matches.length && DEV)
//         console.log(
//             `%cAfterMapping: %c[${pool.map((v) => ("kind" in v ? v.kind : tokenDefs.find((def) => def.id === v.type)?.name))}]`,
//             "color:lightblue",
//             "color:turquoise",
//         );

//     // If matches is not empty, then rerun the whole thing, if not then rerun but to the next ruleIndex
//     return RunRule(
//         pool,
//         rules,
//         tokenDefs,
//         matches.length > 0 ? 0 : ruleIndex + 1,
//         Logging,
//         Logs,
//         MAX_RECURSION_GUARD - 1,
//     );
//     // return { pool }
// };

export const produceAST = (
    params: ReturnType<typeof PrepareParser>,

    // Recursive Parameters
    ruleIndex = 0,
    MAX_RECURSION_GUARD = 100,
): {
    pool: ParsePoolItem[];
    history?: ParseProcessLog[];
} => {
    const {
        pool,
        rules,
        tokenDefs,
        log,
        history,
        onEvalError,
        onError,
        T,
        TX,
    } = params;

    const output = { pool, history };
    const runtimeLog: any[] = [];
    const _execution_id = genid(16);
    const _onError = (msg: string, line: number, column: number) =>
        onError(msg, line, column, _execution_id);

    // Base Case
    if (ruleIndex > rules.length - 1) return output;

    const rule = rules[ruleIndex];

    if (MAX_RECURSION_GUARD <= 0) {
        onEvalError(
            new Error("MAX_RECURSION_GUARD Exceeded"),
            "other",
            _execution_id,
        );

        if (log) {
            history.push({
                id: _execution_id,
                rule,
                ruleIndex,
                matches: [],
                pool: JSON.parse(JSON.stringify(pool)),
                logs: runtimeLog,
            });
        }

        return output;
    }

    // Run Matching
    const matches: [number, number][] = [];

    let MAX_LOOP = pool.length + 3;
    while (MAX_LOOP--) {
        const offset = matches.reduce((max, [s, n]) => Math.max(max, s + n), 0);
        if (offset > pool.length - 1) break;

        const args = RuleMatchArgsBuilder(
            {
                history,
                log,
                rules,
                T,
                tokenDefs,
                TX,
                onEvalError,
                // Changed
                pool: pool.slice(offset),
                onError: _onError,
            },
            runtimeLog,
        );
        const result = RunParseMatch(rule, args, (e) => {
            onEvalError(e, "match", _execution_id);
        });

        if (!result) break;

        const [start, length] = result;
        if (start === -1) break;
        matches.push([offset + start, length]);
    }

    // Run Mapper
    matches.reduce((offset, [s, l]) => {
        const start = offset + s;

        // Generate RuleMapperArgs
        const args = RuleMapperArgsBuilder(
            params,
            [start, start + l],
            rule,
            runtimeLog,
        );

        // Pass to a mapper
        RunParseMapper(rule, args, (e) => {
            onEvalError(e, "map", _execution_id);
        });
        const generatedNode = args.data();

        pool.splice(start, l, ...generatedNode);
        return offset - (l - 1);
    }, 0);

    if (log) {
        history.push({
            id: _execution_id,
            rule,
            ruleIndex,
            matches,
            pool: JSON.parse(JSON.stringify(pool)),
            logs: runtimeLog,
        });
    }

    return produceAST(
        params,
        matches.length > 0 ? 0 : ruleIndex + 1,
        matches.length > 0 ? MAX_RECURSION_GUARD - 1 : 100,
    );
};

export const checkASTHealth = (pool: ParsePoolItem[]): boolean => {
    if (!pool) return false;
    return !pool.some((item) => {
        if (!item) return true;
        if (isToken(item)) return false;
        return !checkASTHealth(item.body);
    });
};
