import { useTokenStore } from "@/stores/token";
import type { Token, TokenDef } from "@/types/Token";
import { storeToRefs } from "pinia";

const token = (matchLength: number, def: TokenDef, source: string) => {
    return <Token>{
        type: def.id,
        value: source.slice(0, matchLength)
    }
}

export const tokenize = (source: string): Token[] => {
    const tokenStore = useTokenStore();
    const { tokens: definitions, reserves } = tokenStore; 

    const tokens = new Array<Token>();

    for (let i = 0; i < source.length; i++) {
        const args = [ source.slice(i), source ];

        // Check if it starts with a reserve keyword
        const ___reserveMatches = reserves.filter(rw => args[0].startsWith(rw.value));

        // If it has a match then skip the next portion
        if(___reserveMatches.length > 0 && !!___reserveMatches[0].value){
            const { type: rmType, value: rmValue } = ___reserveMatches[0];
            const rmDef = definitions.find(def => def.id === rmType);
            
            if(!!rmDef){
                tokens.push(token(rmValue.length, rmDef, args[0]));
                i += rmValue.length - 1;
                continue;
            }
        }

        const matches = definitions.map<[number, TokenDef]>(def => {
            let result = -1;
            try {
                result = eval(def.match) || -1;
            } catch { }
            return [result, def];
        }).filter(([result, def]) => result !== -1);
        // If there are no matches, display an error/warning messsage
        if (matches.length === 0) {
            console.warn(`No token matches at this: `, source[i], args);
            continue;
        }
        // Add the first result in the tokens array
        const [length] = matches[0];

        tokens.push(token(...matches[0], args[0]))
        i += length - 1;
    }

    return tokens;
}

// export enum TokenType {

//     Number,
//     Identifier,

//     BinaryOperator,

//     Equals,

//     OpenParen, CloseParen,

//     Let,
//     Const
// }

// export interface Token {
//     value: string,
//     type: TokenType
// }
// const token = (type: TokenType, value: string) => (<Token>{ value, type });

// export interface TokenDefinition {
//     type: TokenType,
//     tester: (str: string, first: string, whole: string) => string | null
// }

// export const tokenize = ( sourceCode: string, definitions: TokenDefinition[] ) : Token[] => {
//     const tokens = new Array<Token>();
//     const src = sourceCode.split('');

//     for(let i = 0; i < src.length; i++){
//         const c = src[0];

//         const sliced = sourceCode.slice(i);
//         const matched = definitions.find(d => d.tester(sliced, c, sourceCode) !== null);
//         const matchResult = !!matched ? matched.tester(sliced, c, sourceCode) : null;
//         if(!matched || !matchResult) continue;

//         // Create token based on matched result
//         tokens.push(token(matched.type, matchResult));
//         // Jump to the length of the result - 1
//         i += matchResult.length - 1;
//     }


//     return tokens;
// }