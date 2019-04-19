<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">Create Project</h3>
        <v-divider class="my-3"></v-divider>
      </v-flex>
    </v-layout>
    <v-layout wrap justify-space-between v-if="loadingScreen">
      <v-progress-linear :indeterminate="true"></v-progress-linear>
    </v-layout>
    <v-layout wrap justify-space-between v-if="!loadingScreen">
      <v-flex xs12 md12 mx-auto>
        <form
          class="xs12"
          ref="form"
          lazy-validation
          v-model="valid"
          novalidate
        >

          <v-card>
            <v-card-text>
              <div class="headline mb-3">General Information</div>
              <v-text-field
                v-model="project.name"
                v-validate="'required'"
                :error-messages="errors.collect('name')"
                label="Name"
                data-vv-name="name"
                required
                :success="errors.collect('name').length < 1"
              ></v-text-field>

              <v-text-field
                v-model="project.path"
                v-validate="'required'"
                :error-messages="errors.collect('path')"
                label="Path"
                data-vv-name="path"
                required
                :success="errors.collect('path').length < 1"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>

              <div class="headline">Build Job</div>

              <v-checkbox
                v-for="(platform, index) in configuration.available_build_platforms"
                :key="index"
                v-model="build_jobs"
                :label="platform"
                :value="platform"
                hide-details
              ></v-checkbox>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <div class="headline">Test Job</div>

              <v-checkbox
                v-for="(_, index) in configuration.available_test_platforms"
                :key="index"
                v-model="test_jobs"
                :label="index"
                :value="index"
                hide-details
              ></v-checkbox>
            </v-card-text>
          </v-card>

          <v-divider class="mt-4 mb-3"></v-divider>

          <v-btn to="/projects">Back</v-btn>
          <v-btn @click="submit"
                 class="secondary"
                 :disabled="$validator.errors.count() > 0 || loadingSave"
                 :loading="loadingSave"
          >
            <v-icon left dark>save</v-icon>
            Save
          </v-btn>

        </form>
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
      loadingScreen: false,
      loadingSave: false,
      configuration: {
        available_build_platforms: [],
        available_test_platforms: []
      },
      build_jobs: [],
      test_jobs: [],
      id: '',
      project: {
        name: '',
        path: '',
        build_jobs: [],
        test_jobs: []
      },
      dictionary: {
        custom: {
          name: {
            required: 'Name can not be empty'
          },
          path: {
            required: 'Path can not be empty'
          }
        }
      }
    }),

    mounted () {
      axios
        .get(process.env.API_URI + '/global_configuration')
        .then(
          (result) => {
            this.loadingScreen = false
            this.configuration = result.data
          }
        )
    },

    methods: {
      submit () {
        this.loadingSave = true
        this.$validator.validateAll()
          .then((value) => {
            if (value) {
              this.project.build_jobs = this.build_jobs
              this.project.test_jobs = this.test_jobs
              axios
                .post(
                  process.env.API_URI + '/projects',
                  this.project
                )
                .then(
                  () => {
                    const self = this
                    setTimeout(function () {
                      self.loadingSave = false
                      self.$router.push('/projects')
                    }, 2000)
                  }
                )
            } else {
              this.loadingSave = false
            }
          })
      }
    }
  }
</script>

