import Vue from "vue";
import App from "./src/app";

Vue.config.devtools = true

new Vue({
    render: h => h(App)
}).$mount("#app")