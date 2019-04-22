<template>
  <v-app :class="userIsAuthenticated ? '' : 'primary'">
    <v-navigation-drawer fixed temporary v-model="sideNav" v-if="userIsAuthenticated">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="userIsAuthenticated"
          @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed dark class="primary" v-if="userIsAuthenticated">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up "></v-toolbar-side-icon>
      <v-toolbar-side-icon class="hidden-xs-only">
        <img src="/static/img/jenkins_logo.png" style="top: -14px; position: relative;">
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Jenkins Management by Code</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}

        </v-btn>
        <v-btn
          v-if="userIsAuthenticated"
          flat
          @click="onLogout">
          <v-icon left dark>exit_to_app</v-icon>
          Logout

        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main style="height: calc(100% - 50px)">
      <router-view></router-view>
    </main>
    <v-footer
      dark
      fixed
      height="auto"
      v-if="userIsAuthenticated"
    >
      <v-card
        class="flex"
        style="border-radius: 0"
        flat
        tile
      >

        <v-card-actions class="grey darken-3 justify-center">
          &copy;2019 - <strong> Jenkins Management by Code</strong>
          <v-spacer></v-spacer>
          Powered by
          <v-img
            slot="offset"
            class="mx-auto d-inline ml-3"
            style="max-width: 100px; max-height: 28px"
            src="/static/img/logo-pedidosya-white.svg"
          ></v-img>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          // {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign in', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'work', title: 'Projects', link: '/projects'},
            {icon: 'widgets', title: 'Plugins', link: '/plugins'},
            {icon: 'devices', title: 'Platforms', link: '/platforms'},
            {icon: 'settings', title: 'Configuration', link: '/configuration'},
            {icon: 'person', title: 'Profile', link: '/profile'}
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/signin')
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
  @import url('https://fonts.googleapis.com/css?family=Lato|Muli');

  * {
    font-family: 'Muli', 'Lato', sans-serif;
  }

  main {
    margin-top: 80px;
  }

  .v-card {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .14);
    border-radius: 6px;
  }

  .v-card .v-toolbar {
    width: 96%;
    left: 2%;
    border-radius: 6px;
    top: -20px;
  }

  div[role="listitem"] {
    cursor: pointer;
  }

  .v-card .v-toolbar .v-toolbar__content {
    margin-top: 30px;
  }

  .v-list__tile__action {
    min-width: 36px;
  }

  .v-list__tile__action .v-input--checkbox {
    margin-top: 10px;
  }

</style>
