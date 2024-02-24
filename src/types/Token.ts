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