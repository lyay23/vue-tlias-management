import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/index/index.vue'
import clazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LogView from '@/views/log/index.vue'
import stuView from '@/views/stu/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import stuReportView from '@/views/report/stu/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {path:'/',
     name:'',
     component: LayoutView,
     redirect:'/index',
     children:[
      {path:'index',name:'index',component:IndexView},
      {path:'clazz',name:'clazz',component:clazzView},
      {path:'dept',name:'dept',component:DeptView},
      {path:'emp',name:'emp',component:EmpView},
      {path:'log',name:'log',component:LogView},
      {path:'stuReport',name:'stuReport',component:stuView},
      {path:'empReport',name:'empReport',component:stuReportView},
     ]
    },
    { path: '/login', name: 'login', component: LoginView }
  ]
})

export default router