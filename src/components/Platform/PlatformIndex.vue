<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>

    <v-layout row wrap>
      <v-flex xs12 sm12 md12>

        <v-layout align-center row>
          <v-flex>
            <h3 class="display-3">
              Platform Configuration
            </h3>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <v-layout row mt-3 justify-space-between v-if="loadingScreen">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-layout>

        <v-alert
          :value="true"
          color="info"
          icon="info"
          outline
          v-if="!loadingScreen && configurations == null"
        >
          No platform found. Try creating a new one.
        </v-alert>

        <v-layout
          v-if="!loadingScreen"
          v-for="(item, scope) in configurations"
          :key="scope"
          row mt-3
        >
          <v-flex>
            <v-card>
              <v-toolbar color="primary" dark>
                <v-icon>folder</v-icon>

                <v-toolbar-title>
                  {{scope.toString().charAt(0).toUpperCase()}}{{scope.substring(1)}}
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-speed-dial
                  direction="left"
                  transition="scale-transition"
                >
                  <template v-slot:activator>
                    <v-btn
                      flat
                      fab
                    >
                      <v-icon>more_vert</v-icon>
                      <v-icon>close</v-icon>
                    </v-btn>
                  </template>

                  <v-tooltip
                    top
                    v-for="(menu_item, i) in items_menu"
                    :key="i"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        dark
                        small
                        :color="menu_item.color"
                        v-on="on"
                        @click="do_action_menu(menu_item.action, scope)"
                      >
                        <v-icon>{{menu_item.icon}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{menu_item.title}}</span>
                  </v-tooltip>
                </v-speed-dial>

              </v-toolbar>

              <v-list-tile
                v-for="(p, id) in item"
                :key="id"
                style="cursor: pointer"
                avatar
                @click="$router.push('/platforms/' + scope + '/platforms/' + id + '/show')"
              >
                <v-list-tile-avatar>
                  <v-icon>extension</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ p.name }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">chevron_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>

            </v-card>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>

  </v-container>
</template>
<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        loadingScreen: true,
        loadingDelete: false,
        platformToDelete: null,
        platformNameToDelete: '',
        items_menu: [
          {
            title: 'Add Platform',
            icon: 'add',
            action: 'add_platform',
            color: 'blue'
          }
        ],
        configurations: {
          build: {},
          test: {}
        }
      }
    },

    mounted () {
      this.initialize()
    },

    watch: {},

    methods: {
      initialize () {
        this.loadingScreen = true
        axios
          .get(process.env.API_URI + '/platforms')
          .then(response => {
            if (response.data != null) {
              this.configurations = response.data
            }
            if (!this.configurations.hasOwnProperty('build')) {
              this.configurations['build'] = {}
            }
            if (!this.configurations.hasOwnProperty('test')) {
              this.configurations['test'] = {}
            }
            this.loadingScreen = false
          })
      },
      do_action_menu (action, scope) {
        switch (action) {
          case 'add_platform':
            this.add_platform(scope)
            break
          default:
            console.error('Menu action no implemented')
        }
      },
      add_platform (scope) {
        switch (scope) {
          case 'build':
            this.$router.push('/platforms/build/platforms/new')
            break
          case 'test':
            this.$router.push('/platforms/test/platforms/new')
            break
        }
      }
    }
  }
</script>

