export interface Token {
    value: string;
    type: number;
    line: number;
    col: number;
}

export interface TokenDef {
    id: number;
    name: string;
    match: string;
}

export interface ReservedWord extends Token {
    id: number;
}

export interface TokenDefMatchArgs {
    slice: string;
    whole: string;
}

export const TokenDefMatchArgsBuilder = (
    str: string,
    start: number,
): TokenDefMatchArgs =>
    <TokenDefMatchArgs>{ slice: str.slice(start), whole: str };

export const RunTokenMatch = (
    def: TokenDef,
    args: TokenDefMatchArgs,
    handleError?: (e: any) => any,
): string | number | undefined => {
    try {
        return eval(def.match)(args) as number;
    } catch (e) {
        if (handleError) return handleError(e);
    }
};

// Utility Functions

export const GetTokenDef = (
    token: Token,
    tokenDefs: TokenDef[],
): TokenDef | undefined => {
    return tokenDefs.find((def) => def.id === token.type);
};
