import type { ASTNode } from "@/types/Node";
import type { Token, TokenDef } from "@/types/Token";

export type ParsePoolItem = Token | ASTNode;

export const isToken = (v: ParsePoolItem): v is Token => !!v && "type" in v;
export const isNode = (v: ParsePoolItem): v is ASTNode => !!v && "kind" in v;
export const isMatch = (v: ParsePoolItem, ...types: (string | number)[]) =>
  !!v &&
  types.some(
    (type) =>
      (typeof type === "string" && isNode(v) && v.kind === type) ||
      (typeof type === "number" && isToken(v) && v.type === type),
  );
