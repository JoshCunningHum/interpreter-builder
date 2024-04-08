export const isStringIn = (
    str: string,
    sources: string[],
    mode: "or" | "and" = "or",
) => {
    return mode === "and"
        ? sources.every((v) => v.toLowerCase().includes(str.toLowerCase()))
        : sources.some((v) => v.toLowerCase().includes(str.toLowerCase()));
};
