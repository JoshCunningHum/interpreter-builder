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

export interface ExecuteNodeParams
    extends ReturnType<typeof PrepareInterpreter> {
    node: ASTNode;
    logs: InterpretLog[];
    log: boolean;
}

export const ExecuteNode = async (
    params: ExecuteNodeParams,
): Promise<RuntimeVal> => {
    const { node, defs, log, logs, cpError } = params;
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
            });
        }

        return __undefined__;
    }

    const args: EvalDefArgs = {
        ...EvalFunctionBuilder(params, runtimeLog),
        hasProp,
        hasPropType,
        isNum,
        isString,
        isBoolean,
    };

    const buffer: { error?: string } = {
        error: undefined,
    };

    const result = await RunEvalDefLogic(def, args, (e) => {
        buffer.error = _execution_id;
        cpError(e, _execution_id);
    });

    if (log) {
        logs.push(
            Object.assign(
                {
                    args: JSON.parse(
                        JSON.stringify({
                            children: args.children,
                            data: args.data,
                            N: args.N,
                            template: args.template,
                        }),
                    ),
                    node,
                    result,
                    rule: def,
                    log: runtimeLog,
                },
                buffer,
            ),
        );
    }

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
