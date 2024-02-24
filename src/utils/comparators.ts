export const alphabeticalComparator = (ascending = true) => ((a: string, b: string) => {
    let result = a < b ? -1 : b < a ? 1 : 0;
    return result * (ascending ? 1 : -1);
})