import { createRouter, createWebHistory } from "vue-router"

import { auth } from "@/firebase"
import store from "@/store"

import Home from "@/views/Home"
import EmployeeList from "@/views/EmployeeList"
import Planner from "@/views/Planner"
import Employee from "@/views/Employee"
import Auth from "@/views/Auth"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      name: "Home",
    },
    {
      path: "/auth",
      component: Auth,
      name: "Auth",
      meta: { 
        noAuth: true,
        title: "Login",
       },
    },
    {
      path: "/staff",
      component: EmployeeList,
      name: "EmployeeList",
      meta: { 
        admin: true,
        title: "Staff",

       },
    },
    {
      path: "/planner/:weekId?",
      component: Planner,
      name: "Planner",
      meta: { 
        admin: true,
       },
      async beforeEnter(to) {
        const weekId = to.params.weekId || store.getters["date/weekId"] || (await store.dispatch("date/getWeekId"))
        store.dispatch("date/setDates", weekId)
        document.title = `Week ${store.getters["date/weekNumber"]} - Planner`

      },
    },
    {
      path: "/employee",
      component: Employee,
      name: "Employee",
      async beforeEnter() {
        const user = store.getters['auth/user']
        document.title = `${user.firstName} ${user.lastName} - Planner`

      },
    },
  ],
})

router.beforeEach((to, from, next) => {

  let title = "Planner"

  if (to.meta.title) {
    title = `${to.meta.title} - ${title}`
  }

  document.title = title
  
  if (!to.meta.noAuth && !auth.currentUser) {
    next({ name: "Auth" })
  } else if (to.meta.admin && !store.getters["auth/admin"]) {
    next({ name: "Employee" })
  } else {
    next()
  }
})

export default router
