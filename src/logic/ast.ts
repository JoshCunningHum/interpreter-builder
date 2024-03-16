import {
    TokenDefMatchArgsBuilder,
    type Token,
    type TokenDef,
} from "@/types/Token";
import {
    RuleMatchArgsBuilder,
    type ASTNode,
    type ParseRule,
    RunParseMatch,
    RuleMapperArgsBuilder,
    RunParseMapper,
} from "@/types/Node";
import type { ParseProcessLog } from "@/stores/parser";
import genid from "@/utils/genid";
import { isToken, type ParsePoolItem } from "@/utils/builder/parserutils";

const DEV = false;

const RunRule = (
    pool: (Token | ASTNode)[],
    rules: ParseRule[],
    tokenDefs: TokenDef[],
    ruleIndex = 0,
    Logging: boolean = false,
    Logs: ParseProcessLog[] = [],
    MAX_RECURSION_GUARD = 100,
): {
    pool: (Token | ASTNode)[];
    history?: ParseProcessLog[];
    error?: string;
} => {
    // Base Case
    if (ruleIndex > rules.length - 1 || MAX_RECURSION_GUARD <= 0)
        return { pool, history: Logs };

    const rule = rules[rules.length - (ruleIndex + 1)];
    if (DEV)
        console.log(
            `%cStarting iteration for %c<${rule.name}>`,
            "color:cyan",
            "color:teal",
        );

    // Run Matching
    const matches: [number, number][] = [];

    let MAX_LOOP = pool.length * 2;
    while (MAX_LOOP--) {
        const start = matches.reduce(
            (max, [s, n]) => (max > s + n ? max : s + n),
            0,
        );

        if (start > pool.length - 1) break;

        const args = RuleMatchArgsBuilder(pool.slice(start), tokenDefs, rules);

        const result = RunParseMatch(rule, args, (e) => {
            console.error(`Error on parsing rule: ${rule.name}`, e);
        });

        if (DEV) console.log(rule.name, start, args, result, matches);

        if (((r: any): r is [number, number] => Array.isArray(r))(result)) {
            const [_start, _n] = result;
            if (_start === -1) break;
            matches.push([_start + start, _n]);
        } else if (result instanceof Error) {
            return { pool, error: result.message };
        } else if (result === undefined) break;
    }

    if (matches.length && DEV) console.log(matches);
    else if (DEV)
        console.log("%cNo Matches in this iteration", "color:crimson");

    // Run Mapper
    matches.reduce((offset, [s, l]) => {
        const start = offset + s;

        // Generate RuleMapperArgs
        const args = RuleMapperArgsBuilder(
            pool,
            [start, start + l],
            rule,
            tokenDefs,
        );

        // Pass it to the mapper
        const error = RunParseMapper(rule, args, (e) =>
            console.error(`Error on mapping: ${rule.name}`, e),
        );

        const generatedNode = args.data();

        pool.splice(start, l, generatedNode);

        return -(l - 1);
    }, 0);

    if (Logging) {
        Logs.push({
            id: genid(16),
            rule,
            ruleIndex,
            matches,
            pool: structuredClone(pool),
        });
    }

    if (matches.length && DEV)
        console.log(
            `%cAfterMapping: %c[${pool.map((v) => ("kind" in v ? v.kind : tokenDefs.find((def) => def.id === v.type)?.name))}]`,
            "color:lightblue",
            "color:turquoise",
        );

    // If matches is not empty, then rerun the whole thing, if not then rerun but to the next ruleIndex
    return RunRule(
        pool,
        rules,
        tokenDefs,
        matches.length > 0 ? 0 : ruleIndex + 1,
        Logging,
        Logs,
        MAX_RECURSION_GUARD - 1,
    );
    // return { pool }
};

export const produceAST = ({
    tokens,
    rules,
    excludeTokens,
    tokenDefs,
    log = false,
}: {
    tokens: Token[];
    rules: ParseRule[];
    tokenDefs: TokenDef[];
    excludeTokens: number[];
    log: boolean;
}) => {
    const pool = tokens.filter(
        (t) => !excludeTokens.some((exc) => exc === t.type),
    );

    return RunRule(pool, rules, tokenDefs, 0, log);
};

export const checkASTHealth = (pool: ParsePoolItem[]): boolean => {
    return !pool.some((item) => {
        if (!item) return true;
        if (isToken(item)) return false;
        return !checkASTHealth(item.body);
    });
};
