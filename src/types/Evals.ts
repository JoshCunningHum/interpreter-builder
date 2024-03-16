// Eval Definitions

import {
    hasProp,
    hasPropType,
    isNum,
    isString,
    isBoolean,
} from "@/utils/common";
import type { ASTNode } from "./Node";
import type { RuntimeVal } from "@/logic/values";
import { EvalFunctionBuilder } from "@/utils/builder/interpreterutil";
import type { ParsePoolItem } from "@/utils/builder/parserutils";

export interface EvalDef {
    id: number;
    kind: string;
    logic: string;
}

export interface EvalDefArgs extends ReturnType<typeof EvalFunctionBuilder> {
    hasProp: typeof hasProp;
    hasPropType: typeof hasPropType;
    isNum: typeof isNum;
    isString: typeof isString;
    isBoolean: typeof isBoolean;
}

export const ExecuteNode = (
    node: ASTNode,
    defs: EvalDef[],
    tree: ParsePoolItem[],
    handleError?: (e: any) => any,
): RuntimeVal => {
    const def = defs.find((def) => def.kind === node.kind);
    if (!def)
        throw new Error(`Node [${node.kind}] does not have an Eval rule.`);
    const args = EvalDefArgsBuilder({ def, node, tree, defs });
    return RunEvalDefLogic(def, args, handleError);
};

export const EvalDefArgsBuilder = ({
    def,
    node,
    tree,
    defs,
}: {
    def: EvalDef;
    node: ASTNode;
    tree: ParsePoolItem[];
    defs: EvalDef[];
}): EvalDefArgs => {
    const args = EvalFunctionBuilder(node, tree, defs);

    return {
        ...args,

        hasProp,
        hasPropType,
        isNum,
        isString,
        isBoolean,
    };
};

export const RunEvalDefLogic = (
    evaldef: EvalDef,
    args: EvalDefArgs,
    handleError?: (e: any) => any,
): RuntimeVal | any => {
    try {
        eval(evaldef.logic)(args) as RuntimeVal;
        return args.template;
    } catch (e) {
        if (handleError) return handleError(e);
    }
};
