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

// export const produceAST = (
//     params: ReturnType<typeof PrepareParser>,

//     // Recursive Parameters
//     ruleIndex = 0,
//     MAX_RECURSION_GUARD = 100,
// ): {
//     pool: ParsePoolItem[];
//     history?: ParseProcessLog[];
// } => {
//     const {
//         pool,
//         rules,
//         tokenDefs,
//         log,
//         history,
//         onEvalError,
//         onError,
//         T,
//         TX,
//     } = params;

//     const output = { pool, history };
//     const runtimeLog: any[] = [];
//     const _execution_id = genid(16);
//     const _onError = (msg: string, line: number, column: number) =>
//         onError(msg, line, column, _execution_id);

//     // Base Case
//     if (ruleIndex > rules.length - 1) return output;

//     const rule = rules[ruleIndex];

//     if (MAX_RECURSION_GUARD <= 0) {
//         onEvalError(
//             new Error("MAX_RECURSION_GUARD Exceeded"),
//             "other",
//             _execution_id,
//         );

//         if (log) {
//             history.push({
//                 id: _execution_id,
//                 rule,
//                 ruleIndex,
//                 matches: [],
//                 pool: JSON.parse(JSON.stringify(pool)),
//                 logs: runtimeLog,
//             });
//         }

//         return output;
//     }

//     // Run Matching
//     const matches: [number, number][] = [];

//     let MAX_LOOP = pool.length + 3;
//     while (MAX_LOOP--) {
//         const offset = matches.reduce((max, [s, n]) => Math.max(max, s + n), 0);
//         if (offset > pool.length - 1) break;

//         const args = RuleMatchArgsBuilder(
//             {
//                 history,
//                 log,
//                 rules,
//                 T,
//                 tokenDefs,
//                 TX,
//                 onEvalError,
//                 // Changed
//                 pool: pool.slice(offset),
//                 onError: _onError,
//             },
//             runtimeLog,
//         );
//         const result = RunParseMatch(rule, args, (e) => {
//             onEvalError(e, "match", _execution_id);
//         });

//         if (!result) break;

//         const [start, length] = result;
//         if (start === -1) break;
//         matches.push([offset + start, length]);
//     }

//     // Run Mapper
//     matches.reduce((offset, [s, l]) => {
//         const start = offset + s;

//         // Generate RuleMapperArgs
//         const args = RuleMapperArgsBuilder(
//             params,
//             [start, start + l],
//             rule,
//             runtimeLog,
//         );

//         // Pass to a mapper
//         RunParseMapper(rule, args, (e) => {
//             onEvalError(e, "map", _execution_id);
//         });
//         const generatedNode = args.data();

//         pool.splice(start, l, ...generatedNode);
//         return offset - (l - 1);
//     }, 0);

//     if (log) {
//         history.push({
//             id: _execution_id,
//             rule,
//             ruleIndex,
//             matches,
//             pool: JSON.parse(JSON.stringify(pool)),
//             logs: runtimeLog,
//         });
//     }

//     return produceAST(
//         params,
//         matches.length > 0 ? 0 : ruleIndex + 1,
//         matches.length > 0 ? MAX_RECURSION_GUARD - 1 : 100,
//     );
// };

// Rewrite of the parser processing into iterative Map every Match instead of Match all then Map all
export type ParseOutput = {
    pool: ParsePoolItem[];
    history?: ParseProcessLog[];
    error?: string;
};

export const produceAST = (
    params: ReturnType<typeof PrepareParser>,
): ParseOutput => {
    const {
        pool,
        rules,
        tokenDefs,
        log,
        history,
        T,
        TX,
        onError: _onError,
        onEvalError,
    } = params;

    const output: ParseOutput = { pool, history };
    let ruleindex = 0;
    let hasError = false;

    // Loop through all rule definition
    while (!hasError && ruleindex < rules.length) {
        const rule = rules[ruleindex];
        const execution_id = genid(16);

        const onError = (msg: string, line: number, column: number) => {
            // Add a history error
            output.error = msg;
            return _onError(msg, line, column, execution_id);
        };

        const runtimelog: any[] = [];
        const matches: [number, number][] = [];

        // Loop until there are no matches
        let MAX_LOOP = pool.length + 1; // infinite loop guard
        while (!hasError && MAX_LOOP--) {
            const match_args = RuleMatchArgsBuilder(
                {
                    history,
                    log,
                    rules,
                    T,
                    tokenDefs,
                    TX,
                    onEvalError,
                    pool,
                    onError,
                },
                runtimelog,
            );

            const match_result = RunParseMatch(rule, match_args, (e) =>
                onEvalError(e, "match", execution_id),
            );

            if (!match_result) break;

            const [start, length] = match_result;
            if (start === -1) break;

            matches.push([start, length]);

            const map_args = RuleMapperArgsBuilder(
                params,
                [start, start + length],
                rule,
                runtimelog,
            );

            RunParseMapper(rule, map_args, (e) => {
                console.log(`%c${rule.name} - ${rule.id}`, "color: red");
                return onEvalError(e, "map", execution_id);
            });

            const map_result = map_args.data();

            pool.splice(start, length, ...map_result);
        }

        if (log) {
            history.push({
                id: execution_id,
                rule,
                ruleIndex: ruleindex,
                matches,
                pool: JSON.parse(JSON.stringify(pool)),
                logs: runtimelog,
            });
        }

        ruleindex = matches.length > 0 ? 0 : ruleindex + 1;
    }

    return output;
};

export const checkASTHealth = (pool: ParsePoolItem[]): boolean => {
    if (!pool) return false;
    return !pool.some((item) => {
        if (!item) return true;
        if (isToken(item)) return false;
        return !checkASTHealth(item.body);
    });
};
