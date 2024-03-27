export interface RuntimeVal {
    type: string;
    value: any;
    error?: string;
}

export const __undefined__: RuntimeVal = {
    type: "undefined",
    value: undefined,
};
