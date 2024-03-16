import { useTokenStore } from "@/stores/token";
import type { Token, TokenDef, TokenDefMatchArgs } from "@/types/Token";
import { storeToRefs } from "pinia";

const token = (matchLength: number, def: TokenDef, source: string) => {
  return <Token>{
    type: def.id,
    value: source.slice(0, matchLength),
  };
};

export const tokenize = (source: string): Token[] => {
  const tokenStore = useTokenStore();
  const { tokens: definitions, reserves } = tokenStore;

  const tokens = new Array<Token>();

  for (let i = 0; i < source.length; i++) {
    const args = <TokenDefMatchArgs>{
      slice: source.slice(i),
      whole: source,
    };

    // Check if it starts with a reserve keyword
    const ___reserveMatches = reserves.filter((rw) =>
      args.slice.startsWith(rw.value),
    );

    // If it has a match then skip the next portion
    if (___reserveMatches.length > 0 && !!___reserveMatches[0].value) {
      const { type: rmType, value: rmValue } = ___reserveMatches[0];
      const rmDef = definitions.find((def) => def.id === rmType);

      if (!!rmDef) {
        tokens.push(token(rmValue.length, rmDef, args.slice));
        i += rmValue.length - 1;
        continue;
      }
    }

    const matches = definitions
      .map<[number, TokenDef]>((def) => {
        let result = -1;
        try {
          result = eval(def.match)(args) || -1;
        } catch {}
        return [result, def];
      })
      .filter(([result, def]) => result !== -1);
    // If there are no matches, display an error/warning messsage
    if (matches.length === 0) {
      console.warn(`No token matches at this: `, source[i], args.whole);
      continue;
    }
    // Add the first result in the tokens array
    const [length] = matches[0];

    tokens.push(token(...matches[0], args.slice));
    i += length - 1;
  }

  return tokens;
};
