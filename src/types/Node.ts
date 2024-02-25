export interface ASTNodeType {
    id: number;
    name: string;
}

export interface ASTNode {
    kind: ASTNodeType;
    body: ASTNode[];
    data: Record<string, any>;
}

export interface ParseRule {
    id: number;
    name: string;
    match: string;
    mapper: string;
}