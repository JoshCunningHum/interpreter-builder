import type { ASTNode } from "@/types/Node";
import type { RuntimeVal } from "./values";
import { type EvalDef, type EvalDefArgs, ExecuteNode } from "@/types/Evals";
import type { PrepareInterpreter } from "@/utils/builder/interpreterinit";
import type { ParsePoolItem } from "@/utils/builder/parserutils";

export type InterpretLog =
    | {
          rule: EvalDef;
          node: ASTNode;
          args: {
              N: Record<string, string>;
              template: RuntimeVal;
              children: ParsePoolItem[];
              data: Record<string, any>;
          };
          result: RuntimeVal;
          log?: any[];
      }
    | {
          rule?: EvalDef;
          args?: EvalDefArgs;
          result?: RuntimeVal;
          node: ASTNode;
          error: string;
          log?: any[];
      };

export const evaluateAST = async (
    args: ReturnType<typeof PrepareInterpreter>,
    log = false,
    // Recursive Values
    index = 0,
): Promise<RuntimeVal> => {
    const { tree, getLast, setLast, logs } = args;
    if (index >= tree.length) return getLast();

    const node = tree[index];
    const result = await ExecuteNode({
        ...args,
        node,
        logs,
        log,
    });

    setLast(result);

    return await evaluateAST(args, log, index + 1);
};
