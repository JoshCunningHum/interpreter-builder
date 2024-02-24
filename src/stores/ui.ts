import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue";

export enum Menu {
    Editor,
    Process,
    Builder,
    Settings
}

export const useUiStore = defineStore("ui", () => {
    const menu = ref(Menu.Editor);

    return {
        menu
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
