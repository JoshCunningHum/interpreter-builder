import type { RuntimeVal } from "@/logic/values";
import { ExecuteNode, type ExecuteNodeParams } from "@/types/Evals";
import type { ASTNode } from "@/types/Node";

export const EvalFunctionBuilder = (
    params: ExecuteNodeParams,
    logs?: any[],
) => {
    const { node, N } = params;

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
    const error = (v: string) => (template.error = v);
    const execute = async (node: ASTNode) => {
        return await ExecuteNode(Object.assign(params, { node }));
    };
    const log = (...e: any[]) => {
        if (!logs) return;
        logs.push(...e);
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
    };
};
