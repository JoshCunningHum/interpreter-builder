export const __print_handler__ = (cb: (value: string) => void) => {
    return (value: string) => cb(value);
};

export const __error_handler__ = (
    cb: (value: string, line: number, column: number) => void,
) => {
    // TODO: Add a way to determine which line and column it got the error
    return (value: string) => cb(value, 0, 0);
};

export const __scan_handler__ = (
    onRequest: (msg: string, answer: (value: string) => void) => Promise<void>,
) => {
    return async (msg: string) => {
        return await new Promise<string>((resolve) => {
            onRequest(msg, (answer) => resolve(answer));
        });
    };
};
