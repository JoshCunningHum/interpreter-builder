import type { ASTNode, ParseRule } from "@/types/Node";
import type { ParsePoolItem } from "./parserutils";
import { produceAST } from "@/logic/ast";
import type { PrepareParser } from "./parseinit";

type splitbycallback = (
    item: ParsePoolItem,
    index: number,
    arry: ParsePoolItem[],
) => boolean;

export const ParseMapFunctionBuilder = (
    params: ReturnType<typeof PrepareParser>,
    rule: ParseRule,
    pool: ParsePoolItem[],
    runtimeLog?: any[],
) => {
    const { onError } = params;

    const result: ASTNode[] = [
        {
            kind: rule.name,
            body: [],
            data: {},
        },
    ];

    const setKind = (kind: string) => {
        result[0] = result[0] || { kind: kind };
        result[0].kind = kind;
        result[0].body = result[0].body || [];
    };
    const setBody = (values: ParsePoolItem[]) => {
        result[0] = result[0] || { body: values };
        result[0].body = values;
    };
    const setData = (data: Record<string, any>) => {
        result[0] = result[0] || { data: data };
        result[0].data = data;
        result[0].body = result[0].body || [];
    };
    const setResults = (items: ASTNode[]) => {
        result.splice(0);
        result.push(...items);
    };
    const range = (start: number, end: number) => pool.slice(start, end + 1);
    const data = () => result;
    const at = (n: number) => (n >= 0 && n < pool.length ? pool[n] : undefined);
    const log = (...params: any[]) => runtimeLog?.push(...params);
    const splitBy = (array: ParsePoolItem[], isSplitter: splitbycallback) => {
        return array.reduce((group, item, i) => {
            if (group.length === 0) group.push([]);
            const last = group[group.length - 1];

            if (isSplitter(item, i, array)) group.push([]);
            else last.push(item);

            return group;
        }, [] as ParsePoolItem[][]);
    };
    const error = (msg: string, line = -1, column = -1) => {
        onError(msg, line, column);
    };

    return {
        result,
        setKind,
        setBody,
        setData,
        setResults,
        range,
        data,
        at,
        log,
        splitBy,
        error,
    };
};
