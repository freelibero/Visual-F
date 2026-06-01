import { createApp } from "vue";
import { createPinia } from "pinia";
import DataV from "@kjgl77/datav-vue3";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(DataV);
app.mount("#app");
