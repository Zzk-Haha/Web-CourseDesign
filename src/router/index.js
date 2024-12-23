//引入依赖及组件
import { createRouter, createWebHistory } from 'vue-router';

import LabReseration from '../components/LabReseration.vue'
import Login from '../components/Login.vue'

const routes = [
    {
        path:'/',
        redirect:'/login',

    },
    {
        path:'/login',
        name:'Login',
        component:Login
    },
    {
        path:'/index',
        name:'LabReseration',
        component:LabReseration
    },


];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
