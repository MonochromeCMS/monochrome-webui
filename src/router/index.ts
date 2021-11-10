import Vue from 'vue';
import type { RouteConfig } from 'vue-router';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    component: () => import(/* webpackChunkName: "manga" */ '../views/Manga.vue'),
    name: 'Manga',
    path: '/manga',
  },
  {
    component: () => import(/* webpackChunkName: "manga_create" */ '../views/MangaCreate.vue'),
    name: 'MangaCreate',
    path: '/manga/new',
  },
  {
    component: () => import(/* webpackChunkName: "manga_detail" */ '../views/MangaDetail.vue'),
    name: 'MangaDetail',
    path: '/manga/:manga',
  },
  {
    component: () => import(/* webpackChunkName: "manga_edit" */ '../views/MangaEdit.vue'),
    name: 'MangaEdit',
    path: '/manga/:manga/edit',
  },
  {
    component: () => import(/* webpackChunkName: "chapter_upload" */ '../views/ChapterUpload.vue'),
    name: 'ChapterUpload',
    path: '/manga/:manga/upload',
  },
  {
    component: () => import(/* webpackChunkName: "chapter_edit" */ '../views/ChapterReader.vue'),
    name: 'ChapterReader',
    path: '/chapters/:chapter',
  },
  {
    component: () => import(/* webpackChunkName: "chapter_edit" */ '../views/ChapterEdit.vue'),
    name: 'ChapterEdit',
    path: '/chapters/:chapter/edit',
  },
  {
    component: () => import(/* webpackChunkName: "users" */ '../views/OwnUser.vue'),
    name: 'OwnUser',
    path: '/users/me',
  },
  {
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue'),
    name: 'Users',
    path: '/users',
  },
  {
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    name: 'Settings',
    path: '/settings',
  },
  {
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    name: 'Login',
    path: '/login',
  },
  {
    component: () => import(/* webpackChunkName: "login" */ '../views/Register.vue'),
    name: 'Register',
    path: '/register',
  },
  {
    component: () => import(/* webpackChunkName: "logout" */ '../views/Logout.vue'),
    name: 'Logout',
    path: '/logout',
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    name: 'About',
    path: '/about',
  },
  {
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    name: 'Home',
    path: '/',
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes,
});

export default router;
