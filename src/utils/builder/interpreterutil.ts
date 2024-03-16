import type { ASTNode } from "@/types/Node";
import { isNode, type ParsePoolItem } from "./parserutils";
import { EvalDefArgsBuilder, ExecuteNode, type EvalDef } from "@/types/Evals";
import type { RuntimeVal } from "@/logic/values";

const NodeIdentifier = (tree: ParsePoolItem[]): Record<string, string> => {
    const result: Record<string, string> = {};

    const queue = Array<ASTNode>();
    queue.push(
        ...tree.filter<ASTNode>((node): node is ASTNode => isNode(node)),
    );
    while (queue.length) {
        const node = queue.shift();
        if (!node) break; // Won't happen, just a typescript thing
        result[node.kind] = node.kind;

        queue.push(
            ...node.body.filter<ASTNode>((n): n is ASTNode => isNode(n)),
        );
    }

    return result;
};

export const EvalFunctionBuilder = (
    node: ASTNode,
    tree: ParsePoolItem[],
    defs: EvalDef[],
) => {
    const N = NodeIdentifier(tree);
    const template: RuntimeVal = {
        type: node.kind,
        value: undefined,
    };
    const SetType = (t: string) => (template.type = t);
    const SetValue = (v: string | number | undefined) => (template.value = v);
    const execute = (node: ASTNode, handleError?: (e: any) => any) =>
        ExecuteNode(node, defs, tree, handleError);
    const children = node.body;
    const data = node.data;

    return {
        N,
        template,
        children,
        data,

        SetType,
        SetValue,
        execute,
    };
};
