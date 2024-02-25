import type { Token } from "@/types/Token";
import type { ASTNode, ASTNodeType, ParseRules } from "@/types/Node"

interface ASTRuntime {
    tokenIndex: number;
}

const parseNode = () => {

}

export const produceAST = (tokens: Token[], nodeTypes: ASTNodeType[], runtime: ASTRuntime = {
    tokenIndex: 0
}) => {

    // Utility Functions
    const current = () => tokens[runtime.tokenIndex];
    const eat = () => tokens[runtime.tokenIndex++];
    const collect = (n: number) => {
        const { tokenIndex: start } = runtime;
        runtime.tokenIndex += n;
        tokens.slice(start, start + n);
    }
}