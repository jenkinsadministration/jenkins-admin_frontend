<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>

    <v-layout row wrap>
      <v-flex xs12 sm12 md12>

        <v-layout align-center row>
          <v-flex>
            <h3 class="display-3">
              Projects
              <v-btn
                fab
                right
                color="secondary"
                to="/projects/new"
                style="float: right; top: 10px;"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </h3>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <v-layout wrap justify-space-between v-if="loadingScreen">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-layout>

        <v-alert
          :value="true"
          color="info"
          icon="info"
          outline
          v-if="!loadingScreen && projects.length === 0"
        >
          No projects found. Try creating a new one.
        </v-alert>

        <v-layout
          v-if="!loadingScreen && projects.length > 0"
          v-for="item in projects"
          :key="item.id"
          row mt-3
        >
          <v-flex>
            <v-card>
              <v-toolbar color="primary" dark>
                <v-icon>folder</v-icon>

                <v-toolbar-title>
                  {{item.data.name}}
                  <small class="grey--text text--lighten-2">« {{item.data.path}} »</small>
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

              <v-subheader inset v-if="item.data.hasOwnProperty('build_jobs')">Build Jobs</v-subheader>

              <v-list-tile
                v-if="item.data.hasOwnProperty('build_jobs')"
                v-for="(job, id) in item.data.jobs.build"
                :key="id"
                style="cursor: pointer"
                @click="$router.push('/projects/' + item.id + '/jobs/build/' + id)"
                avatar
              >
                <v-list-tile-avatar>
                  <v-icon>extension</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ job.platform }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">chevron_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>

              <v-subheader inset v-if="item.data.hasOwnProperty('test_jobs')">Test Jobs</v-subheader>

              <v-list-tile
                v-if="item.data.hasOwnProperty('test_jobs')"
                v-for="(job, id) in item.data.jobs.test"
                :key="id"
                style="cursor: pointer"
                @click="$router.push('/projects/' + item.id + '/jobs/test/' + id)"
                avatar
              >
                <v-list-tile-avatar>
                  <v-icon>extension</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ job.platform }}{{ job.platform !== job.browser ? ' - ' + job.browser : '' }}
                  </v-list-tile-title>
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
    <v-dialog
      v-model="dialogDelete"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline darken-3 error white--text"
          primary-title
        >
          Delete Project
        </v-card-title>

        <v-card-text class="text-xs-center">
          Are you sure that you want to delete the project «{{projectNameToDelete}}»?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-progress-linear :indeterminate="true" v-if="loadingDelete"></v-progress-linear>
          <v-btn
            flat
            v-if="!loadingDelete"
            @click="dialogDelete = false"
          >
            Cancel
          </v-btn>
          <v-spacer v-if="!loadingDelete"></v-spacer>
          <v-btn
            color="warning"
            flat
            v-if="!loadingDelete"
            @click="confirm_delete()"
          >
            Yes, delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        loadingScreen: true,
        dialogDelete: false,
        loadingDelete: false,
        projectToDelete: null,
        projectNameToDelete: '',
        items_menu: [
          {
            title: 'Edit',
            icon: 'edit',
            action: 'edit',
            color: 'green'
          },
          {
            title: 'Delete',
            icon: 'delete',
            action: 'delete',
            color: 'red'
          }
        ],
        projects: []
      }
    },

    computed: {
      user () {
        return this.$store.getters.user
      }
    },

    mounted () {
      this.load_projects()
    },

    methods: {
      load_projects () {
        this.loadingScreen = true
        axios
          .get(
            process.env.API_URI + '/projects',
            {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
          )
          .then(response => {
            this.projects = response.data
            this.loadingScreen = false
          })
      },

      do_action_menu_project (action, project) {
        switch (action) {
          case 'edit':
            this.$router.push('/projects/' + project.id + '/edit')
            break
          case 'add_job':
            this.$router.push('/projects/' + project.id + '/jobs/new')
            break
          case 'delete':
            this.dialogDelete = true
            this.projectToDelete = project
            this.projectNameToDelete = project.data.name
            break
        }
      },

      confirm_delete () {
        this.loadingDelete = true
        axios
          .delete(
            process.env.API_URI + '/projects/' + this.projectToDelete.id,
            {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
          )
          .then(() => {
            this.loadingDelete = false
            this.dialogDelete = false
            this.load_projects()
          })
      }
    }
  }
</script>

