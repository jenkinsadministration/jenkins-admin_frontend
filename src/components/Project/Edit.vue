<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">Edit Project</h3>
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
        >
          <v-card class="mx-auto pa-4">

            <v-text-field
              v-model="project.name"
              v-validate="'required'"
              :error-messages="errors.collect('name')"
              label="Name"
              data-vv-name="name"
              required
              success
            ></v-text-field>

            <v-text-field
              v-model="project.path"
              v-validate="'required'"
              :error-messages="errors.collect('path')"
              label="Path"
              data-vv-name="path"
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
      loadingScreen: true,
      loadingSave: false,
      id: '',
      project: {
        name: '',
        path: ''
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
      this.id = this.$route.params.id
      axios
        .get('http://localhost:5000/jenkinsadmin/us-central1/api/projects/' + this.id)
        .then(response => {
          this.project = response.data.data
          this.loadingScreen = false
        })
    },

    methods: {
      submit () {
        this.loadingSave = true
        this.$validator.validateAll()
          .then((value) => {
            if (value) {
              axios
                .put(
                  'http://localhost:5000/jenkinsadmin/us-central1/api/projects/' + this.id,
                  this.project
                )
                .then(
                  () => {
                    this.loadingSave = false
                    this.$router.push('/projects')
                  }
                )
            }
          })
      }
    }
  }
</script>

