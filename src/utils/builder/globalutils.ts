import { isObject } from "@vueuse/core";

export const binder = (obj: object) => {
    return __binder__(obj, obj);
};

const __binder__ = (obj: any, root: object) => {
    if (isObject(obj)) {
        Object.entries(obj).forEach(([key, val]) => {
            // @ts-expect-error nah trust me bro
            if (key in obj) obj[key] = __binder__(val, root);
        });
    }
    if (typeof obj === "function") return obj.bind(root);

    return obj;
};
