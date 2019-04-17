<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">Create Job</h3>
        <v-divider class="my-3"></v-divider>
      </v-flex>
    </v-layout>
    <v-layout wrap justify-space-between v-if="loadingScreen">
      <v-progress-linear :indeterminate="true"></v-progress-linear>
    </v-layout>
    <v-layout wrap justify-space-between v-if="!loadingScreen">
      <v-flex xs12 md8 mx-auto>
        <form
          class="xs12"
          ref="form"
          lazy-validation
          v-model="valid"
          novalidate
          @submit="submit"
        >
          <v-card class="mx-auto pa-4">

            <v-text-field
              v-model="job.name"
              v-validate="'required'"
              :error-messages="errors.collect('name')"
              label="Name"
              data-vv-name="name"
              required
              success
            ></v-text-field>

            <v-btn to="/projects">Back</v-btn>
            <v-btn @click="submit"
                   class="secondary"
                   :disabled="$validator.errors.count() > 0 || loadingSave"
                   :loading="loadingSave"
            >
              <v-icon left dark>save</v-icon>
              Save
            </v-btn>
          </v-card>
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
      projectId: '',
      job: {
        name: ''
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
      this.projectId = this.$route.params.projectId
    },

    methods: {
      submit (e) {
        e.preventDefault()
        this.loadingSave = true
        this.$validator.validateAll()
          .then((value) => {
            if (value) {
              axios
                .post(
                  'http://localhost:5000/jenkinsadmin/us-central1/api/projects/' + this.projectId + '/jobs',
                  this.job
                )
                .then(
                  () => {
                    this.loadingSave = false
                    this.$router.push('/projects')
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

