export type TypeOfTypes =
  | "string"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "symbol"
  | "undefined";

export const hasProp = (obj: Record<string, any>, prop: string) => prop in obj;

export const hasPropType = (
  obj: Record<string, any>,
  prop: string,
  ...types: TypeOfTypes[]
) => {
  if (typeof obj !== "object") return false;
  return prop in obj && types.some((type) => typeof obj[prop] === type);
};

export const isNum = (v: any): v is number => typeof v === "number";
export const isString = (v: any): v is string => typeof v === "string";
export const isBoolean = (v: any): v is boolean => typeof v === "boolean";
export const isArray = (v: any): v is Array<any> =>
  typeof v === "object" && Array.isArray(v);
export const isObject = (v: any): v is Object =>
  typeof v === "object" && !isArray(v);
