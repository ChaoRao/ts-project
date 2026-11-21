import { createRouter, createWebHistory } from 'vue-router'
import PatientVisitView from '@/views/PatientVisitView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/patients' },
    {
      path: '/patients',
      name: 'PatientVisit',
      component: PatientVisitView,
      meta: { title: '患者就诊信息' },
    },
  ],
})

export default router
