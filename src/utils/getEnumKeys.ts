
type Enum = Record<string | number, string | number>
export default  <T extends Enum>(enumType: T): string[] => Object.keys(enumType).filter(v => isNaN(Number(v)));