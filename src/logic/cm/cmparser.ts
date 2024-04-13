import {
    Parser,
    Tree,
    TreeFragment,
    type Input,
    type PartialParse,
} from "@lezer/common";

export class CodeParser extends Parser {
    createParse(
        input: Input,
        fragments: readonly TreeFragment[],
        ranges: readonly { from: number; to: number }[],
    ): PartialParse {
        throw new Error("Method not implemented.");
    }
}
