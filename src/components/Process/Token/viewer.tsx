import type { Token, TokenDef } from "@/types/Token";
import genid from "@/utils/genid";
import { QTooltip } from "quasar";

interface ViewerProps {
  code?: string;
  tokens?: Token[];
  tokenDefs?: TokenDef[];
  exceptions?: number[];
}

const splitter = (source: string, tokens: Token[]) => {
  let cursor = 0;

  return [...tokens, null]
    .map((token) => {
      const tokenStartAt =
        token === null
          ? source.length + 1
          : source.slice(cursor).indexOf(token.value);

      const elements: (string | Token)[] = [];
      if (tokenStartAt > 0) {
        const sliced = source.slice(cursor, cursor + tokenStartAt);
        cursor += sliced.length;
        elements.push(sliced);
      }
      if (token !== null) {
        cursor += token.value.length;
        elements.push(token);
      }

      return elements;
    })
    .flat();
};

interface TokenElementProps {
  token: Token;
  exceptions: number[];
  definitions: TokenDef[];
}

const TokenElement = ({
  token,
  definitions,
  exceptions,
}: TokenElementProps) => {
  const def = definitions.find((def) => def.id === token.type);
  const isExcempt = exceptions.includes(token.type);

  return (
    <span
      class={`text-white ${isExcempt ? "" : "bg-green-500/30 outline"} outline-1 -outline-offset-1 outline-green-500`}
    >
      {token.value}
      {def && !isExcempt && (
        <QTooltip
          // @ts-ignore
          class="bg-primary px-2 py-0.5 text-sm "
          anchor="bottom middle"
          self="top middle"
        >
          {def.name}
        </QTooltip>
      )}
    </span>
  );
};

export default ({
  code = "",
  tokenDefs = [],
  tokens = [],
  exceptions = [],
}: ViewerProps) => {
  const lines = code.split("\n");

  return (
    <div class="flex gap-2 p-4">
      <pre class="select-none text-base text-neutral-500">
        {lines.map((_, i) => i + 1).join("\n")}
      </pre>
      <pre class="text-red font-mono text-base">
        {splitter(code, tokens).map((value) =>
          typeof value === "string" ? (
            <>{value}</>
          ) : (
            <TokenElement
              definitions={tokenDefs}
              exceptions={exceptions}
              token={value}
              key={genid()}
            />
          ),
        )}
      </pre>
    </div>
  );
};
