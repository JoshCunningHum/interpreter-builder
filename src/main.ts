import { createApp } from "vue";
import { Quasar, Dialog } from "quasar";
import quasarIconSet from "quasar/icon-set/mdi-v7";
import { createPinia } from "pinia";
import JsonViewer from "vue3-json-viewer";

// Import JsonViewer Theme
import "vue3-json-viewer/dist/index.css";
import "@/assets/jsonviewer.scss";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/mdi-v7/mdi-v7.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Import Quasar Config
import QuasarConfig from "./quasar.config";

import "./assets/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(JsonViewer).use(createPinia()).use(Quasar, {
    plugins: {
        Dialog,
    }, // import Quasar plugins and add here
    iconSet: quasarIconSet,
    config: QuasarConfig,

    /*
    config: {
      brand: {
        // primary: '#e46262',
        // ... or all other brand colors
      },
      notify: {...}, // default set of options for Notify Quasar plugin
      loading: {...}, // default set of options for Loading Quasar plugin
      loadingBar: { ... }, // settings for LoadingBar Quasar plugin
      // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
    */
});

app.mount("#app");
