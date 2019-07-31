// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'

const App = () => import('./App')
import * as firebase from 'firebase'
import router from './router'
import {store} from './store'

const AlertCmp = () => import('./components/Shared/Alert.vue')

Vue.use(Vuetify, {
  theme: {
    primary: '#F52F41',
    secondary: '#00BDED',
    accent: '#8bc34a',
    error: '#f44336',
    warning: '#ffc107',
    info: '#00bcd4',
    success: '#4caf50'
  }
})
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyDF4SuIYx-RsQLtWp9uVbbITkD8mvDzJ6I',
      authDomain: 'jenkinsadmin.firebaseapp.com',
      databaseURL: 'https://jenkinsadmin.firebaseio.com',
      projectId: 'jenkinsadmin',
      storageBucket: 'jenkinsadmin.appspot.com',
      messagingSenderId: '724713534471'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
  }
})
