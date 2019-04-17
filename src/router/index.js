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

const JobShow = () => import('@/components/Job/Show')
const JobEdit = () => import('@/components/Job/Edit')

const PluginsIndex = () => import('@/components/Configuration/Plugins')

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
      path: '/projects/:projectId/jobs/:type/:id',
      name: 'JobShow',
      component: JobShow
    },
    {
      path: '/projects/:projectId/jobs/:type/:id/edit',
      name: 'JobEdit',
      component: JobEdit
    },
    {
      path: '/plugins',
      name: 'PluginsIndex',
      component: PluginsIndex
    }
  ],
  mode: 'history'
})
