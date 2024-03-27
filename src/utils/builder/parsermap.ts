import type { ASTNode, ParseRule } from "@/types/Node";
import type { ParsePoolItem } from "./parserutils";
import { produceAST } from "@/logic/ast";

export const ParseMapFunctionBuilder = (
    rule: ParseRule,
    pool: ParsePoolItem[],
    runtimeLog?: any[],
) => {
    const result: ASTNode[] = [];

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
    const range = (start: number, end: number) => {
        const indexes = Array(end - start + 1)
            .fill(0)
            .map((_, i) => start + i);
        return pool.filter((_, i) => indexes.includes(i));
    };
    const data = () => result;
    const at = (n: number) => (n >= 0 && n < pool.length ? pool[n] : undefined);
    const log = (...params: any[]) => runtimeLog?.push(...params);

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
    };
};
