const dupFormat = (str: string, repeat: number) => `${str}(${repeat})`

const findDup = (list: string[], find: string, formatter: typeof dupFormat, repeatition = 0) : number => {
    const processed = repeatition === 0 ? find : formatter(find, repeatition);
    const index = list.indexOf(processed);
    if(index === -1) return repeatition;
    return findDup(list, find, formatter, repeatition + 1);
}

export default (list: string[], find: string, formatter: typeof dupFormat = dupFormat) => {
    const repeatition = findDup(list, find, formatter);
    return repeatition === 0 ? find : formatter(find, repeatition)
}