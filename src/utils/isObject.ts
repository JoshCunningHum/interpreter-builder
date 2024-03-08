export const isObject = (v: unknown): v is Object => {
  return typeof v === "object";
};
