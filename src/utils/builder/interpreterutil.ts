import type { RuntimeVal } from "@/logic/values";
import { ExecuteNode, type ExecuteNodeParams } from "@/types/Evals";
import type { ASTNode } from "@/types/Node";
import { isMatch } from "./parserutils";

export const EvalFunctionBuilder = (
    params: ExecuteNodeParams,
    execution_id: string,
    logs?: any[],
) => {
    const { node, N, cpError, error: _error, print, scan } = params;

    const template: RuntimeVal = {
        type: node.kind,
        value: undefined,
    };
    const setKind = (t: string) => (template.type = t);
    const setValue = (v: string | number | undefined) => (template.value = v);
    const setAsStatement = () => {
        template.type = "undefined";
        template.value = undefined;
    };
    const error = (v: string, line = -1, col = -1) => {
        template.error = v;
        _error(v, execution_id, line, col);
    };
    const execute = async (node: ASTNode) => {
        return await ExecuteNode(Object.assign(params, { node }));
    };
    const log = function (...e: any[]) {
        if (!logs) return;
        logs.push(...e);
    };
    const is = (v: RuntimeVal, type: string) => {
        if (!("type" in v)) {
            cpError(
                new Error("non-runtime value passed on is() function"),
                execution_id,
            );

            return false;
        }
        return v.type === type;
    };
    const awaitAll = async <V, T>(
        arr: V[],
        cb: (v: V, i: number, arr: V[]) => Promise<T>,
    ) => {
        const results: T[] = [];

        for (let i = 0; i < arr.length; i++) {
            results.push(await cb(arr[i], i, arr));
        }

        return results;
    };
    const children = node.body;
    const data = node.data;

    return {
        N,
        template,
        children,
        data,

        setKind,
        setValue,
        setAsStatement,
        execute,
        error,
        log,
        is,
        awaitAll,
        isMatch,
        print,
        scan,
    };
};
