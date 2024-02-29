import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from "@/views/SignUpView.vue"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"
import store from "@/store"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/login",
      name: "login",
      component: LoginView
    },

    {
      path: "/signup",
      name: "signUp",
      component: SignUpView
    }
  ]
})

export default router
