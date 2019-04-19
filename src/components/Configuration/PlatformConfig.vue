<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>

    <v-layout row wrap>
      <v-flex xs12 sm12 md12>

        <v-layout align-center row>
          <v-flex>
            <h3 class="display-3">
              Plugins
            </h3>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <v-layout row mt-3 justify-space-between v-if="loadingScreen">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-layout>

        <v-layout
          v-if="!loadingScreen"
          v-for="(item, index) in configurations"
          :key="index"
          row mt-3
        >
          <v-flex>
            <v-card>
              <v-toolbar color="primary" dark>
                <v-icon>folder</v-icon>

                <v-toolbar-title>
                  {{item.name}}
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
                    v-for="(menu_item, index) in items_menu"
                    :key="index"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        dark
                        small
                        :color="menu_item.color"
                        v-on="on"
                        @click="do_action_menu_project(menu_item.action, item)"
                      >
                        <v-icon>{{menu_item.icon}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{menu_item.title}}</span>
                  </v-tooltip>
                </v-speed-dial>

              </v-toolbar>

              <v-list-tile
                v-if="item.hasOwnProperty('platforms')"
                v-for="(p, id) in item.platforms"
                :key="id"
                style="cursor: pointer"
                avatar
              >
                <v-list-tile-avatar>
                  <v-icon>extension</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ p.data.name }}</v-list-tile-title>
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
  export default {
    data: function () {
      return {
        loadingScreen: false,
        items_menu: [
          {
            title: 'Add Platform',
            icon: 'add',
            action: 'add_platform',
            color: 'blue'
          }
        ],
        configurations: {
          test: {
            name: 'Test',
            platforms: []
          },
          build: {
            name: 'Build',
            platforms: []
          }
        }
      }
    },

    computed: {},

    watch: {},

    methods: {
      initialize () {
      }
    }
  }
</script>

