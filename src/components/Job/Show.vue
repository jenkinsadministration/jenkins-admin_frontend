<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">View Job</h3>
        <v-divider class="my-3"></v-divider>
      </v-flex>
    </v-layout>
    <v-layout wrap justify-space-between v-if="loadingScreen">
      <v-progress-linear :indeterminate="true"></v-progress-linear>
    </v-layout>
    <v-layout wrap justify-space-between v-if="!loadingScreen">
      <v-flex xs12 md12 mx-auto>

        <v-card>
          <v-card-text>
            <div class="headline mb-3">General Information</div>

            <v-label>Path</v-label>
            <p>{{job.full_name}}</p>

            <v-label>Template</v-label>
            <p>{{job.setup.template}}</p>

            <v-label>Platform</v-label>
            <p>{{job.platform}}</p>

            <v-label v-if="job.browser && job.browser !== job.platform">Browser</v-label>
            <p v-if="job.browser && job.browser !== job.platform">{{job.browser}}</p>

          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-text>
            <div class="headline mb-3">Source Code Management</div>

            <v-label>Repository</v-label>
            <p>{{job.setup.repository}}</p>

            <v-label>Branch</v-label>
            <p>{{job.setup.branch}}</p>

          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-text>
            <div class="headline mb-3">Run Setup</div>

            <v-label v-if="job.setup.cron.build !== ''">Build Cron</v-label>
            <p v-if="job.setup.cron.build !== ''">{{job.setup.cron.build}}</p>

            <v-label v-if="job.setup.cron.poll_scm !== ''">Poll SCM Cron</v-label>
            <p v-if="job.setup.cron.poll_scm !== ''">{{job.setup.cron.poll_scm}}</p>

            <v-label>Max Builds to Save</v-label>
            <p>{{job.setup.log_rotate}}</p>

          </v-card-text>
        </v-card>

        <v-card class="mt-4" v-if="job.setup.parameters.length > 0">
          <v-card-text>
            <div class="headline mb-3">Parameters</div>

            <v-card
              v-for="(param, index) in job.setup.parameters"
              :key="index"
              flat elevation="0" style="border: solid 1px #e6e6e6;" class="mt-3"
            >
              <v-card-text>
                <p><strong>Name:</strong> {{param.name}}</p>
                <p><strong>Type:</strong> {{param.type.charAt(0).toUpperCase() + param.type.substring(1)}}</p>
                <p v-if="param.is_maven_param"><strong>Maven Name:</strong> {{param.maven_key}}</p>
                <p><strong>Render a Job Parameter:</strong> {{param.is_parameterizable ? 'Yes' : 'No'}}</p>
                <p v-if="param.type !== 'choice'"><strong>Default Value:</strong> {{param.default_value}}</p>
                <p v-if="param.type === 'choice'"><strong>Values:</strong></p>
                <ul v-if="param.type === 'choice'">
                  <li v-for="(v, i) in param.values" :index="i">{{v}}</li>
                </ul>
                <p v-if="param.description !== ''"><strong>Description:</strong> {{param.description}}</p>
              </v-card-text>

            </v-card>

          </v-card-text>
        </v-card>

        <v-card class="mt-4" v-if="false">
          <v-card-text>
            <div class="headline mb-3">Athenea</div>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout wrap justify-space-between>
      <v-flex>
        <v-divider></v-divider>
        <v-btn to="/projects">Back</v-btn>
        <v-btn :to="'./' + id +'/edit'" color="secondary">Edit</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {
    $_veeValidate: {
      validator: 'edit'
    },

    data: () => ({
      valid: true,
      loadingScreen: true,
      projectId: '',
      type: '',
      id: '',
      job: {
        full_name: '',
        platform: '',
        setup: {
          repository: '',
          branch: '',
          log_rotate: '',
          cron: {
            build: '',
            poll_scm: ''
          },
          template: '',
          parameters: [
            {
              name: '',
              maven_key: '',
              is_parameterizable: true,
              is_maven_param: true,
              default_value: '',
              type: 'string',
              description: ''
            }
          ]
        }
      }
    }),

    computed: {
      user () {
        return this.$store.getters.user
      }
    },

    mounted () {
      this.projectId = this.$route.params.projectId
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      axios
        .get(
          process.env.API_URI + '/projects/' + this.projectId + '/jobs/' + this.type + '/' + this.id,
          {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
        )
        .then(response => {
          this.loadingScreen = false
          this.job = response.data.data
          if (!this.job.setup.hasOwnProperty('parameters')) {
            this.job.setup['parameters'] = []
          }
        })
    },

    methods: {}
  }
</script>

