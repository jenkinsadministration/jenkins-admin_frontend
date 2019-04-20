<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">View Platform</h3>
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
            <p><strong>Name: </strong>{{platform.name}}</p>

            <div v-if="platform.has_browsers">
              <p><strong>Browsers: </strong></p>
              <ul>
                <li v-for="(b, i) in platform.browsers" :key="i">{{b}}</li>
              </ul>
            </div>

          </v-card-text>
        </v-card>

        <v-card class="mt-4" v-if="platform.default_parameters.length > 0">
          <v-card-text>
            <div class="headline mb-3">Parameters</div>

            <v-card
              v-for="(param, index) in platform.default_parameters"
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

      </v-flex>
    </v-layout>
    <v-layout wrap justify-space-between>
      <v-flex>
        <v-divider></v-divider>
        <v-btn to="/platforms">Back</v-btn>
        <v-btn :to="'./edit'" color="secondary">Edit</v-btn>
        <v-btn @click="dialogDelete=true" color="error">Delete</v-btn>
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
          Are you sure that you want to delete the platform «{{platform.name}}»?
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
  import Vue from 'vue'
  import axios from 'axios'
  import VeeValidate from 'vee-validate'

  Vue.use(VeeValidate)

  export default {

    data: () => ({
      valid: true,
      loadingScreen: true,
      loadingDelete: false,
      dialogDelete: false,
      id: '',
      scope: '',
      platform: {
        name: '',
        default_parameters: []
      }
    }),

    mounted () {
      this.scope = this.$route.params.scope
      this.id = this.$route.params.id
      axios
        .get(`${process.env.API_URI}/platforms/${this.scope}/${this.id}`)
        .then(response => {
          this.loadingScreen = false
          this.platform = response.data.data
          if (!this.platform.hasOwnProperty('default_parameters')) {
            this.platform['default_parameters'] = []
          }
        })
    },

    methods: {
      confirm_delete () {
        this.loadingDelete = true
        axios
          .delete(`${process.env.API_URI}/platforms/${this.scope}/${this.id}`)
          .then(() => {
            this.loadingDelete = false
            this.dialogDelete = false
            this.$router.push('/platforms')
          })
      }
    }
  }
</script>

