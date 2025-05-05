import { plugins } from "./postcss.config";

module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.{js,vue,ts}",
        "./pages/**/*.{js,vue,ts}",
        "./app.vue"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};