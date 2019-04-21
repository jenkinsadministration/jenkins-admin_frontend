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

import ConfigurationIndex from '../components/Configuration/Index'
import ConfigurationEnvironmentVars from '../components/Configuration/EnvironmentVars'
import ConfigurationCredentials from '../components/Configuration/Credentials'
import ConfigurationToolConfiguration from '../components/Configuration/ToolConfiguration'

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
    },
    {
      path: '/platforms',
      name: 'PlatformIndex',
      component: PlatformIndex
    },
    {
      path: '/platforms/:scope/platforms/new',
      name: 'PlatformNew',
      component: PlatformNew
    },
    {
      path: '/platforms/:scope/platforms/:id/edit',
      name: 'PlatformEdit',
      component: PlatformEdit
    },
    {
      path: '/platforms/:scope/platforms/:id/show',
      name: 'PlatformShow',
      component: PlatformShow
    },
    {
      path: '/configuration',
      name: 'ConfigurationIndex',
      component: ConfigurationIndex
    },
    {
      path: '/configuration/environment_vars',
      name: 'ConfigurationEnvironmentVars',
      component: ConfigurationEnvironmentVars
    },
    {
      path: '/configuration/credentials',
      name: 'ConfigurationCredentials',
      component: ConfigurationCredentials
    },
    {
      path: '/configuration/tool_configurations',
      name: 'ConfigurationToolConfiguration',
      component: ConfigurationToolConfiguration
    }
  ],
  mode: 'history'
})
