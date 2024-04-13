import { Prec } from "@codemirror/state";
import {
    Language,
    LanguageSupport,
    LanguageDescription,
    syntaxTree,
} from "@codemirror/language";

interface CodeConfig {
    /// When given, this language will be used by default to parse code blocks.
    defaultCodeLanguage?: Language | LanguageSupport;
    /// A source of language support for highlighting fenced code
    /// blocks. When it is an array, the parser will use
    /// [`LanguageDescription.matchLanguageName`](#language.LanguageDescription^matchLanguageName)
    /// with the fenced code info to find a matching language. When it
    /// is a function, will be called with the info string and may
    /// return a language or `LanguageDescription` object.
    codeLanguage?:
        | readonly LanguageDescription[]
        | ((info: string) => Language | LanguageDescription | null);
    addKeymap?: boolean;
    base?: Language;
}

export const code = ({
    defaultCodeLanguage,
    codeLanguage,
    addKeymap,
    base,
}: CodeConfig) => {};
