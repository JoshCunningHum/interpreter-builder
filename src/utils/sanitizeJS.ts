export const sanitizeJS = (str: string) => {
    // split all the new lines
    const lines = str.split('\\n')

    // Remove all commends in eac lines
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\/\/.*$/g, '')
    }
    // Remove all empty lines
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length === 0) {
            lines.splice(i, 1)
            i--
        }
    }

    return lines.join(`
`)
}