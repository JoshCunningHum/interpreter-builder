import type { Ref } from "vue";

export const useSwitchSet = <T>(
    state: Ref<T>,
    values: T[][],
    comparator?: (a: T, b: T) => boolean,
) => {
    // Do nothing if values is empty
    if (values.length === 0) return;

    const last = values[values.length - 1];

    // Check for default case first (the last one if it only contains 1 value)
    const defaultValue = last.length === 1 ? last : undefined;

    // Find the current value of the state
    const valueindex = values.findIndex((v, i) => {
        if (!!defaultValue && i === values.length - 1) return false;

        const operands = v.slice(0, -1);

        return operands.some((value) => {
            if (!!comparator) return comparator(value, state.value);
            return value === state.value;
        });
    });

    // If value index is -1, then set the state to the default value if any
    const match = valueindex > -1 ? values[valueindex] : undefined;

    if (match) state.value = match[match.length - 1];
    else if (defaultValue) state.value = defaultValue[0];
};
