import type { EvalDef } from "@/types/Evals";
import type { ASTNode } from "@/types/Node";
import { isNode, type ParsePoolItem } from "./parserutils";
import {
    __error_handler__,
    __print_handler__,
    __scan_handler__,
} from "./interpretertools";
import type { RuntimeVal } from "@/logic/values";
import type { InterpretLog } from "@/logic/interpreter";
import type { PrepareGlobal, PrepareGlobalParams } from "@/logic/environment";

export interface PrepareInterpreterOptions {
    onPrint: (msg: string) => void;
    onScan: (msg: string, onAnswer: (msg: string) => void) => Promise<void>;
    onError: (msg: string, line: number, column: number, id?: string) => void;
    onEvalError: (e: Error, id?: string) => void;
    tree: ASTNode[];
    defs: EvalDef[];
    glob: ReturnType<typeof PrepareGlobal>;
}

export const PrepareInterpreter = ({
    onPrint,
    onScan,
    onError,
    onEvalError,
    tree,
    glob,
    defs,
}: PrepareInterpreterOptions) => {
    const buffer: { last: RuntimeVal } = {
        last: {
            type: "undefined",
            value: undefined,
        },
    };

    const N = NodeIdentifier(tree);
    const print = __print_handler__(onPrint);
    const scan = __scan_handler__(onScan);
    const error = __error_handler__(onError);
    const setLast = (v: RuntimeVal) => (buffer.last = v);
    const getLast = () => buffer.last;

    return {
        N,
        glob,
        tree,
        defs,
        print,
        scan,
        error,
        cpError: onEvalError,
        setLast,
        getLast,
        logs: Array<InterpretLog>(),
    };
};

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
