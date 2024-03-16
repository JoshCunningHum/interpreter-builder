import {
  isNode,
  isMatch,
  isToken,
  type ParsePoolItem,
} from "@/utils/builder/parserutils";
import { GetTokenDef, type Token, type TokenDef } from "./Token";
import {
  NodeIdentifiers,
  ParseMatchFunctionsBuilder,
  TokenIdentifiers,
  type ParseMatchFindWhereCallback,
} from "@/utils/builder/parsermatch";
import { ParseMapFunctionBuilder } from "@/utils/builder/parsermap";

const DEV = false;

export interface ASTNode {
  kind: string;
  body: ParsePoolItem[];
  data: Record<string, any>;
}

export interface ParseRule {
  id: number;
  name: string;
  match: string;
  mapper: string;
}

// #region Matching

export interface RuleMatchArgs {
  pool: ParsePoolItem[];
  T: Record<string, number>;
  N: Record<string, string>;
  TX: Record<string, string>;
  NX: Record<string, string>;

  _rgx: string;

  isToken: typeof isToken;
  isNode: typeof isNode;
  isMatch: typeof isMatch;

  at: (n: number) => ASTNode | Token | undefined;

  find: (
    pattern: (string | number)[],
    where?: ParseMatchFindWhereCallback,
  ) => [number, number] | null;
  findRGX: (
    pattern: string,
    where?: ParseMatchFindWhereCallback,
  ) => [number, number] | null;
  error: (message: string) => Error;
}

// Non-Included Utility Functions

export const RuleMatchArgsBuilder = (
  pool: (Token | ASTNode)[],
  tokenDefs: TokenDef[],
  Rules: ParseRule[],
): RuleMatchArgs => {
  // Utility Objects

  const { T, TX } = TokenIdentifiers(tokenDefs);
  const { N, NX } = NodeIdentifiers(pool);

  // Utility Functions
  const utils = ParseMatchFunctionsBuilder(pool);

  return {
    pool,
    T,
    TX,
    N,
    NX,

    isToken,
    isNode,
    isMatch,

    ...utils,

    // Essential Functions
    error: (message: string) => new Error(message),
  };
};

// #endregion

// #region Mapper

export interface RuleMapperArgs {
  pool: (Token | ASTNode)[];
  start: number;
  end: number;

  T: Record<string, number>;
  N: Record<string, string>;

  setKind: (kind: string) => void;
  setBody: (values: (ASTNode | Token)[]) => void;
  setData: (data: Record<string, any>) => void;
  range: (start: number, end: number) => (ASTNode | Token)[];

  at: (n: number) => ASTNode | Token | undefined;

  isToken: typeof isToken;
  isNode: typeof isNode;
  isMatch: typeof isMatch;

  data: () => ASTNode;
}

export const RuleMapperArgsBuilder = (
  pool: (Token | ASTNode)[],
  [start, end]: [number, number],
  rule: ParseRule,
  tokenDefs: TokenDef[],
): RuleMapperArgs => {
  const { T, TX } = TokenIdentifiers(tokenDefs);
  const { N, NX } = NodeIdentifiers(pool);

  const utils = ParseMapFunctionBuilder(rule, pool);

  return {
    pool,
    start,
    end,
    T,
    N,

    ...utils,

    isMatch,
    isNode,
    isToken,
  };
};

export const RunParseMatch = (
  parseRule: ParseRule,
  args: RuleMatchArgs,
  handleError?: (e: any) => any,
): [number, number] | any => {
  try {
    return eval(parseRule.match)(args) as [number, number];
  } catch (e) {
    if (handleError) return handleError(e);
  }
};

export const RunParseMapper = (
  parseRule: ParseRule,
  args: RuleMapperArgs,
  handleError?: (e: any) => any,
): any => {
  try {
    return eval(parseRule.mapper)(args);
  } catch (e) {
    if (handleError) return handleError(e);
  }
};

// #endregion
