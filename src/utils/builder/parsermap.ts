import type { ASTNode, ParseRule } from "@/types/Node";
import type { ParsePoolItem } from "./parserutils";

export const ParseMapFunctionBuilder = (
  rule: ParseRule,
  pool: ParsePoolItem[],
) => {
  const template: ASTNode = {
    body: [],
    data: {},
    kind: rule.name,
  };

  const setKind = (kind: string) => (template.kind = kind);
  const setBody = (values: ParsePoolItem[]) => (template.body = values);
  const setData = (data: Record<string, any>) => (template.data = data);
  const range = (start: number, end: number) => {
    const indexes = Array(end - start + 1)
      .fill(0)
      .map((_, i) => start + i);
    return pool.filter((_, i) => indexes.includes(i));
  };
  const data = () => template;
  const at = (n: number) => (n >= 0 && n < pool.length ? pool[n] : undefined);

  return {
    template,
    setKind,
    setBody,
    setData,
    range,
    data,
    at,
  };
};
