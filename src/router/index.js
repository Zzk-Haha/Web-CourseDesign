//引入依赖及组件
import { createRouter, createWebHistory } from 'vue-router';

import LabReseration from '../components/LabReservation.vue'
import InfoManage   from "@/components/InfoManage.vue";
import Login from '../components/Login.vue'
import CourseManage from "@/components/CourseManage.vue";
import AdminManage from "@/components/AdminManage.vue";
import CurrentReservation   from "@/components/CurrentReservation.vue";
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
    {
        path:'/infomanage',
        name:'InfoManage',
        component:InfoManage

    },
    {
        path:'/coursemanage',
        name:'CourseManage',
        component:CourseManage
    },
    {
        path:'/adminmanage',
        name:'AdminManage',
        component:AdminManage
    },
    {
        path:'/currentreservation',
        name:'CurrentReservation',
        component:CurrentReservation

    }


];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
