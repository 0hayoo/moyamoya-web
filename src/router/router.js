import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/main.vue";
import Search from "../views/search.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/search", component: Search },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
