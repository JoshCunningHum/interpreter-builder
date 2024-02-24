import type { QuasarPluginOptions } from "quasar/dist/types/plugin";

export default <Partial<QuasarPluginOptions>['config']>{
    extras: [
        'mdi-v7',
    ],
    dark: true
}