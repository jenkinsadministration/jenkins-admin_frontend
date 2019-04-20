import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'

import Profile from '../components/User/Profile'
import Signup from '../components/User/Signup'
import Signin from '../components/User/Signin'

import AuthGuard from './auth-guard'

import ProjectIndex from '../components/Project/Index'
import ProjectEdit from '../components/Project/Edit'
import ProjectNew from '../components/Project/New'

import JobShow from '../components/Job/Show'
import JobEdit from '../components/Job/Edit'

import PluginsIndex from '../components/Plugin/Plugins'

import PlatformIndex from '../components/Platform/PlatformIndex'
import PlatformNew from '../components/Platform/PlatformNew'
import PlatformEdit from '../components/Platform/PlatformEdit'
import PlatformShow from '../components/Platform/PlatformShow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: AuthGuard
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
      component: ProjectIndex,
      beforeEnter: AuthGuard
    },
    {
      path: '/projects/:id/edit',
      name: 'ProjectEdit',
      component: ProjectEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/projects/new',
      name: 'ProjectNew',
      component: ProjectNew,
      beforeEnter: AuthGuard
    },
    {
      path: '/projects/:projectId/jobs/:type/:id',
      name: 'JobShow',
      component: JobShow,
      beforeEnter: AuthGuard
    },
    {
      path: '/projects/:projectId/jobs/:type/:id/edit',
      name: 'JobEdit',
      component: JobEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/plugins',
      name: 'PluginsIndex',
      component: PluginsIndex,
      beforeEnter: AuthGuard
    },
    {
      path: '/platforms',
      name: 'PlatformIndex',
      component: PlatformIndex,
      beforeEnter: AuthGuard
    },
    {
      path: '/platforms/:scope/platforms/new',
      name: 'PlatformNew',
      component: PlatformNew,
      beforeEnter: AuthGuard
    },
    {
      path: '/platforms/:scope/platforms/:id/edit',
      name: 'PlatformEdit',
      component: PlatformEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/platforms/:scope/platforms/:id/show',
      name: 'PlatformShow',
      component: PlatformShow,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
