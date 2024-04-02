import { computed } from "vue";

export const useTrueAlways = () =>
    computed({
        get: () => true,
        set: (b: boolean) => true,
    });
