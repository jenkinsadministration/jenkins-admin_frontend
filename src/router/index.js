import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/components/Home')
const Profile = () => import('@/components/User/Profile')
const Signup = () => import('@/components/User/Signup')
const Signin = () => import('@/components/User/Signin')
import AuthGuard from './auth-guard'

const ProjectIndex = () => import('@/components/Project/Index')
const ProjectEdit = () => import('@/components/Project/Edit')
const ProjectNew = () => import('@/components/Project/New')

const JobNew = () => import('@/components/Job/New')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/projects',
      name: 'ProjectIndex',
      component: ProjectIndex
    },
    {
      path: '/projects/:id/edit',
      name: 'ProjectEdit',
      component: ProjectEdit
    },
    {
      path: '/projects/new',
      name: 'ProjectNew',
      component: ProjectNew
    },
    {
      path: '/projects/:projectId/jobs/new',
      name: 'JobNew',
      component: JobNew
    }
  ],
  mode: 'history'
})
