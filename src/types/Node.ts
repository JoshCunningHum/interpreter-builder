import { GetTokenDef, type Token, type TokenDef } from "./Token";

const DEV = false;

export interface ASTNode {
  kind: string;
  body: ASTNode[];
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
  pool: (Token | ASTNode)[];
  T: Record<string, number>;
  N: Record<string, string>;
  TX: Record<string, string>;
  NX: Record<string, string>;

  _rgx: string;

  isToken: typeof isToken;
  isNode: typeof isNode;
  isMatch: typeof isMatch;

  find: (...pattern: (string | number)[]) => [number, number] | null;
  findRGX: (...pattern: string[]) => [number, number] | null;
  error: (message: string) => Error;
}

// Utility Functions

const isToken = (v: Token | ASTNode): v is Token => "type" in v;
const isNode = (v: Token | ASTNode): v is ASTNode => "kind" in v;
const isMatch = (v: ASTNode | Token, type: string | number) =>
  (typeof type === "string" && isNode(v) && v.kind === type) ||
  (typeof type === "number" && isToken(v) && v.type === type);

// Non-Included Utility Functions

const regexify_char = "\\|";
const regexify = (v: ASTNode | TokenDef | Token) =>
  "id" in v
    ? `${regexify_char}${v.id}`
    : isNode(v)
      ? `${regexify_char}${v.kind}`
      : isToken(v)
        ? `${regexify_char}${v.type}`
        : "";

export const RuleMatchArgsBuilder = (
  pool: (Token | ASTNode)[],
  tokenDefs: TokenDef[],
  Rules: ParseRule[],
): RuleMatchArgs => {
  // Utility Objects

  const T = tokenDefs.reduce(
    (obj, def) => {
      obj[def.name] = def.id;
      return obj;
    },
    {} as Record<string, number>,
  );

  const TX = tokenDefs.reduce(
    (obj, def) => {
      obj[def.name] = regexify(def);
      return obj;
    },
    {} as Record<string, string>,
  );

  const Nodes = pool.filter<ASTNode>((v): v is ASTNode => isNode(v));
  const N = Nodes.reduce(
    (obj, def) => {
      obj[def.kind] = def.kind;
      return obj;
    },
    {} as Record<string, string>,
  );

  const NX = Nodes.reduce(
    (obj, def) => {
      obj[def.kind] = regexify(def);
      return obj;
    },
    {} as Record<string, string>,
  );

  // Pass token and node values arranged in a pattern
  const find = (...pattern: (string | number)[]): [number, number] => {
    if (pattern.length < 0) return [-1, 0];

    const [first, ...rest] = pattern;

    const start = pool.findIndex((v, i, arr) => {
      // Make sure it is the same type
      if (!isMatch(v, first)) return false;

      // If it is the same type, check the rest of the pattern if it matches the next elements
      const slice = arr.slice(i + 1);
      return rest.every((t, ti) => isMatch(slice[ti], t));
    });

    if (start === -1) return [-1, 0];
    return [start, rest.length + 1];
  };

  // The Regexable interpretation of the pool
  const _rgx = pool.map((v) => regexify(v)).join("");

  const findRGX = (...pattern: string[]): [number, number] => {
    const rgx = new RegExp(pattern.join(""), "g");
    const matches = _rgx.match(rgx);
    if (DEV)
      console.log(`%cGenerating RGX: %c${rgx}`, "color:gray", "color:orange");
    if (matches && matches.length) {
      const sanitized_rgx = _rgx.replace(/\\/g, "");
      const foundAt = sanitized_rgx.indexOf(matches[0]);
      const pre = sanitized_rgx.slice(0, foundAt);
      const computed_index = pre.split(regexify_char[1]).length - 1;
      const matchLength = matches[0].split(regexify_char[1]).length - 1;

      if (DEV)
        console.log(
          `%cMatches: [${matches}]. 
                %cFrom: ${sanitized_rgx} 
                ${matches ? `%cFound at: ${computed_index}` : ""}`,
          `color:${matches.length ? "green" : "red"}`,
          "color:lightgreen",
          "color:yellow",
        );

      return [computed_index, matchLength];
    }
    return [-1, 0];
  };

  return {
    pool,
    T,
    TX,
    N,
    NX,

    _rgx,

    isToken,
    isNode,
    isMatch,

    // Helper Functions
    find,
    findRGX,

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

  setKind: (kind: string) => void;
  setBody: (indexes: number[]) => void;
  setData: (data: Record<string, any>) => void;
  range: (start: number, end: number) => number[];

  data: () => ASTNode;
}

export const RuleMapperArgsBuilder = (
  pool: (Token | ASTNode)[],
  [start, end]: [number, number],
): RuleMapperArgs => {
  // ASTNODE Template
  const template: ASTNode = {
    body: [],
    data: {},
    kind: "___NULL___",
  };

  return {
    pool,
    start,
    end,

    setKind: (kind) => (template.kind = kind),
    setBody: (indexes) => pool.filter((_, i) => indexes.includes(i)),
    setData: (data) => (template.data = data),
    range: (start, end) =>
      Array(end - start + 1)
        .fill(0)
        .map((_, i) => start + i),

    data: () => template,
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
