import type { ASTNode } from "@/types/Node";
import type { TokenDef, Token } from "@/types/Token";
import { isMatch, isNode, isToken, type ParsePoolItem } from "./parserutils";

const DEV = false;

const regexify_char = "ᚖ";
const regexify = (v: ASTNode | TokenDef | Token) =>
    "id" in v
        ? `${regexify_char}${v.id}`
        : isNode(v)
          ? `${regexify_char}${v.kind}`
          : isToken(v)
            ? `${regexify_char}${v.type}`
            : "";

export const NodeIdentifiers = (pool: ParsePoolItem[]) => {
    const Nodes = pool.filter<ASTNode>((v): v is ASTNode => isNode(v));
    const N = Nodes.reduce(
        (obj, def) => {
            obj[def.kind] = def.kind;
            return obj;
        },
        {} as Record<string, string>,
    );
    const NX = Nodes.reduce(
        (obj, def) => {
            obj[def.kind] = regexify(def);
            return obj;
        },
        {} as Record<string, string>,
    );

    return {
        N,
        NX,
    };
};

export const TokenIdentifiers = (defs: TokenDef[]) => ({
    T: defs.reduce(
        (obj, def) => {
            obj[def.name] = def.id;
            return obj;
        },
        {} as Record<string, number>,
    ),
    TX: defs.reduce(
        (obj, def) => {
            obj[def.name] = regexify(def);
            return obj;
        },
        {} as Record<string, string>,
    ),
});

export type ParseMatchFindWhereCallback = (
    items: ParsePoolItem[],
    start: number,
    pool: ParsePoolItem[],
) => boolean;

export const ParseMatchFunctionsBuilder = (
    pool: ParsePoolItem[],
    runtimeLog?: any[],
) => {
    const _rgx = pool.map((v) => regexify(v)).join("");

    const find = (
        pattern: (string | number)[],
        where?: ParseMatchFindWhereCallback,
    ): [number, number] => {
        if (pattern.length < 0) return [-1, 0];

        return findRGX(
            pattern.map((t) => `${regexify_char}${t}`).join(""),
            where,
        );
    };

    const findRGX = (
        pattern: string,
        where?: ParseMatchFindWhereCallback,
    ): [number, number] => {
        const rgx = new RegExp(pattern, "g");

        const lastMatch: [number, number] = [0, 0];

        let MAX_LOOPS: number = _rgx.split(regexify_char).length + 2;

        if (DEV) console.log(MAX_LOOPS);

        while (MAX_LOOPS--) {
            const [lastStart, lastLength] = lastMatch;
            const slice = _rgx.slice(lastStart + lastLength);
            if (DEV) {
                console.log(rgx, slice);
            }
            const matches = slice.match(rgx);

            if (matches) {
                const [match] = matches;
                const foundAt = slice.indexOf(match);
                const pre = _rgx.slice(0, foundAt + 1 + lastStart + lastLength);
                const computed_index = pre.split(regexify_char).length - 2;
                const matchLength = match.split(regexify_char).length - 1;

                if (DEV) {
                    console.log(
                        `%cMatches: [${matches}]. 
                %cFrom: ${slice} 
                %cFound at: ${computed_index}
                Length: ${matchLength}
                %cOffset: ${lastStart} ${lastLength}`,
                        `color:${matches.length ? "green" : "red"}`,
                        "color:lightgreen",
                        "color:yellow",
                        "color:orange",
                    );
                }

                // If there is a where condition, try to apply it
                if (where) {
                    const items = pool.slice(
                        computed_index,
                        computed_index + matchLength,
                    );
                    const whereResult = where(items, computed_index, pool);

                    if (DEV) {
                        console.log(
                            `%cWhereConditionResult: %c${whereResult} %c${items.map((i) => ("kind" in i ? i.kind : i.type))}`,
                            "color:pink",
                            `color:${whereResult ? "lightgreen" : "red"}`,
                            "color:orange",
                        );
                    }

                    if (!whereResult) {
                        lastMatch[0] = foundAt;
                        lastMatch[1] = match.length;
                        continue;
                    }
                }

                return [computed_index, matchLength];
            } else break;
        }

        return [-1, 0];
    };

    type splitbycallback = (
        item: ParsePoolItem,
        index: number,
        arry: ParsePoolItem[],
    ) => boolean;

    const log = (...params: any[]) => runtimeLog?.push(...params);
    const range = (start: number, end: number) => pool.slice(start, end + 1);
    const splitBy = (array: ParsePoolItem[], isSplitter: splitbycallback) => {
        return array.reduce((group, item, i) => {
            if (group.length === 0) group.push([]);
            const last = group[group.length - 1];

            if (isSplitter(item, i, array)) group.push([]);
            else last.push(item);

            return group;
        }, [] as ParsePoolItem[][]);
    };

    return {
        _rgx,
        find,
        findRGX,
        log,
        at: (n: number) => (n >= 0 && n < pool.length ? pool[n] : undefined),
        range,
        splitBy,
    };
};
