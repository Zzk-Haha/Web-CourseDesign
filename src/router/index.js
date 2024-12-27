//引入依赖及组件
import { createRouter, createWebHistory } from 'vue-router';

import LabReseration from '../components/LabReservation.vue'
import InfoManage   from "@/components/InfoManage.vue";
import Login from '../components/Login.vue'
import CourseManage from "@/components/CourseManage.vue";
import AdminManage from "@/components/AdminManage.vue";
import CurrentReservation   from "@/components/CurrentReservation.vue";
import CourseReservation   from "@/components/CourseReservation.vue";
import AdminCourse from "@/components/AdminCourse.vue";
import AdminLab from "@/components/AdminLab.vue";
import AdminLabManager from "@/components/AdminLabManager.vue";
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

    },
    {
     path:'/coursereservation',
     name:'CourseReservation',
     component:CourseReservation
    },
    {
     path:'/admincourse',
     name:'AdminCourse',
     component:AdminCourse

    },
    {
     path:'/adminlab',
     name:'AdminLab',
     component:AdminLab
    },
    {
     path:'/adminlabmanager',
     name:'AdminLabManager',
     component:AdminLabManager
    }


];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
