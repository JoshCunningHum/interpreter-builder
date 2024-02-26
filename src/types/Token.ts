export interface Token {
    value: string;
    type: number;
}

export interface TokenDef {
    id: number;
    name: string;
    match: string;
}

export interface ReservedWord extends Token {
    id: number
}

export interface TokenDefMatchArgs {
    slice: string,
    whole: string;
}

export const RunTokenMatch = (def: TokenDef, args: TokenDefMatchArgs, handleError?: (e: any) => void): any => {
    try {
        return eval(def.match)(args);
    } catch (e) {
        if (handleError) return handleError(e);
    }
}