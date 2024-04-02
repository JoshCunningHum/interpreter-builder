// This is where we prepare the global object

import { binder } from "@/utils/builder/globalutils";
import { __undefined__ } from "./values";

export interface PrepareGlobalParams {
    def: string;
    onEvalError: (e: Error) => void;
    onError: (msg: string, line: number, column: number) => void;
    onLog: (...args: any[]) => void;
}

export const PrepareGlobal = (
    params: PrepareGlobalParams,
): Record<string, any> => {
    const { def, onEvalError, onError, onLog } = params;

    // Create Args for use in the global object
    const args = {
        log: onLog,
        error: onError,
        _undefined_: __undefined__,
    };

    try {
        const obj = eval(params.def)(args);
        return binder(obj);
    } catch (e: any) {
        onEvalError(e);
    }

    return {};
};
