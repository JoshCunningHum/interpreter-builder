export const __print_handler__ = (cb: (value: string) => void) => {
    return (value: string) => cb(value);
};

export type ErrorHandlerCallbackFn = (
    value: string,
    line: number,
    column: number,
    id?: string,
) => void;
export const __error_handler__ = (cb: ErrorHandlerCallbackFn) => {
    // TODO: Add a way to determine which line and column it got the error
    return (value: string, id: string = "") => cb(value, 0, 0, id);
};

export type ScanHandlerCallbackFn = (
    msg: string,
    answer: (value: string) => void,
) => Promise<void>;
export const __scan_handler__ = (onRequest: ScanHandlerCallbackFn) => {
    return async (msg: string) => {
        return await new Promise<string>((resolve) => {
            onRequest(msg, (answer) => resolve(answer));
        });
    };
};
