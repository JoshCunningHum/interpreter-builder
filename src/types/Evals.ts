// Eval Definitions
import type { InterpretLog } from "@/logic/interpreter";
import { __undefined__, type RuntimeVal } from "@/logic/values";
import type { PrepareInterpreter } from "@/utils/builder/interpreterinit";
import { EvalFunctionBuilder } from "@/utils/builder/interpreterutil";
import {
    hasProp,
    hasPropType,
    isBoolean,
    isNum,
    isString,
} from "@/utils/common";
import genid from "@/utils/genid";
import type { ASTNode } from "./Node";
import type { PrepareGlobal } from "@/logic/environment";

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
    glob: ReturnType<typeof PrepareGlobal>;
}

export interface ExecuteNodeParams
    extends ReturnType<typeof PrepareInterpreter> {
    node: ASTNode;
    logs: InterpretLog[];
    log: boolean;
}

export const ExecuteNode = async (
    params: ExecuteNodeParams,
): Promise<RuntimeVal> => {
    const { node, defs, log, logs, cpError, glob } = params;
    const runtimeLog = Array<any>();

    const _execution_id = genid(16);

    const def = defs.find((def) => def.kind === node.kind);

    if (!def) {
        const err = new Error(
            `Node [${node.kind}] does not have an Eval rule.`,
        );
        cpError(err, _execution_id);

        if (log) {
            logs.push({
                error: _execution_id,
                node,
                log: runtimeLog,
                global: glob,
            });
        }

        return __undefined__;
    }

    const args: EvalDefArgs = {
        ...EvalFunctionBuilder(params, _execution_id, runtimeLog),
        hasProp,
        hasPropType,
        isNum,
        isString,
        isBoolean,
        glob,
    };

    const buffer: InterpretLog = {
        global: log ? JSON.parse(JSON.stringify(glob)) : {},
        node,
        result: __undefined__,
        rule: def,
        args: log
            ? JSON.parse(
                  JSON.stringify({
                      children: args.children,
                      data: args.data,
                      N: args.N,
                      template: args.template,
                  }),
              )
            : {},
        error: "",
    };
    logs.push(buffer);

    const result = await RunEvalDefLogic(def, args, (e) => {
        buffer.error = _execution_id;
        cpError(e, _execution_id);
    });

    if (log) buffer.result = result;

    return result;
};

export const RunEvalDefLogic = async (
    evaldef: EvalDef,
    args: EvalDefArgs,
    handleError?: (e: Error) => any,
): Promise<RuntimeVal> => {
    try {
        await eval(evaldef.logic)(args);
        return args.template;
    } catch (e) {
        if (
            ((er): er is Error =>
                typeof er === "object" && !!er && "message" in er)(e) &&
            handleError
        )
            handleError(e);
    }
    return __undefined__;
};
