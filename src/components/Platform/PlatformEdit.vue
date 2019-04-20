<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">Edit a {{scopeName}} Platform</h3>
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
          @submit="submit"
          novalidate
        >

          <v-card>
            <v-card-text>
              <div class="headline mb-3">General Information</div>

              <v-text-field
                v-model="platform.name"
                v-validate="'required'"
                :error-messages="errors.collect('name')"
                label="Name"
                data-vv-name="name"
                required
                :success="errors.collect('name').length < 1"
              ></v-text-field>

              <v-checkbox
                v-model="platform.has_browsers"
                label="Has browsers"
                hide-details
              ></v-checkbox>
            </v-card-text>
          </v-card>

          <v-card class="mt-4" v-if="platform.has_browsers">
            <v-card-text>
              <div class="headline mb-3">Browsers</div>
              <v-combobox
                v-model="platform.browsers"
                :items="platform.browsers"
                v-validate="'required'"
                :error-messages="errors.collect('browsers')"
                label="Browsers"
                data-vv-name="browsers"
                multiple
                chips
                :success="platform.browsers.length > 0"
              ></v-combobox>
            </v-card-text>
          </v-card>


          <v-card class="mt-4">
            <v-card-text>
              <div class="headline mb-3">Default Parameters</div>
              <v-card
                v-for="(param, index) in parameters"
                :key="index"
                flat elevation="0" style="border: solid 1px #e6e6e6;" class="mt-3"
              >
                <v-card-text>
                  <v-text-field
                    v-model="param.name"
                    v-validate="'required'"
                    :error-messages="errors.collect('name')"
                    label="Name"
                    data-vv-name="name"
                    required
                    :success="errors.collect('name').length < 1"
                  ></v-text-field>

                  <v-checkbox
                    v-if="param.type === 'boolean'"
                    v-model="param.default_value"
                    label="Default Value"
                    hide-details
                  ></v-checkbox>

                  <v-text-field
                    v-if="param.type === 'string'"
                    v-model="param.default_value"
                    label="Default Value"
                    :success="errors.collect('default_value').length < 1"
                  ></v-text-field>

                  <v-combobox
                    v-if="param.type === 'choice'"
                    v-model="param.values"
                    :items="param.values"
                    v-validate="'required'"
                    :error-messages="errors.collect('values')"
                    label="Values"
                    data-vv-name="values"
                    multiple
                    chips
                    :success="param.values.length > 0"
                  ></v-combobox>

                  <v-checkbox
                    v-model="param.is_maven_param"
                    label="Is Maven Param"
                    hide-details
                  ></v-checkbox>

                  <v-text-field
                    v-if="param.is_maven_param"
                    v-model="param.maven_key"
                    v-validate="'required'"
                    :error-messages="errors.collect('maven_key')"
                    label="Maven Name"
                    data-vv-name="maven_key"
                    required
                    :success="errors.collect('maven_key').length < 1"
                  ></v-text-field>

                  <v-checkbox
                    v-model="param.is_parameterizable"
                    label="Render a Job Parameter"
                    hide-details
                  ></v-checkbox>
                  <v-textarea
                    label="Description"
                    auto-grow
                    v-model="param.description"
                    :success="errors.collect('description').length < 1"
                  ></v-textarea>

                  <v-btn
                    block outline color="error"
                    @click="remove_parameter(index)"
                  >
                    <v-icon left dark>delete</v-icon>
                    Delete Parameter
                  </v-btn>

                </v-card-text>
              </v-card>

              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    block outline color="secondary"
                    v-on="on"
                  >
                    Add a parameter
                  </v-btn>
                </template>
                <v-list>
                  <v-list-tile
                    v-for="(type, index) in parameters_types"
                    :key="index"
                    @click="add_parameters(type.name)"
                  >
                    <v-list-tile-title>{{ type.name }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-card-text>
          </v-card>


          <v-divider class="mt-4 mb-3"></v-divider>

          <v-btn to="/platforms">Back</v-btn>
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
      validator: 'new'
    },

    data: () => ({
      valid: true,
      loadingScreen: false,
      loadingSave: false,
      scopeName: '',
      scope: '',
      id: '',
      platform: {
        name: '',
        has_browsers: false,
        browsers: [],
        default_parameters: []
      },
      parameters: [],
      parameters_types: [
        {
          name: 'Boolean'
        },
        {
          name: 'String'
        },
        {
          name: 'Choice'
        }
      ],
      dictionary: {
        custom: {
          name: {
            required: 'Name can not be empty'
          }
        }
      }
    }),

    computed: {
      user () {
        return this.$store.getters.user
      }
    },

    mounted () {
      this.scope = this.$route.params.scope
      this.scopeName = this.scope.charAt(0).toUpperCase() + this.scope.substring(1)
      this.id = this.$route.params.id
      axios
        .get(
          `${process.env.API_URI}/platforms/${this.scope}/${this.id}`,
          {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
        )
        .then(response => {
          this.loadingScreen = false
          this.platform = response.data.data
          if (!this.platform.hasOwnProperty('default_parameters')) {
            this.platform['default_parameters'] = []
          }
        })
    },

    methods: {
      submit (e) {
        e.preventDefault()
        this.loadingSave = true
        this.$validator.validateAll()
          .then((value) => {
            if (value) {
              if (this.scope === 'test' && !this.platform.has_browsers) {
                this.platform.browsers = [this.platform.name]
              }
              this.platform.default_parameters = this.parameters
              axios
                .put(
                  `${process.env.API_URI}/platforms/${this.scope}/${this.id}`,
                  this.platform,
                  {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
                )
                .then(
                  () => {
                    const self = this
                    setTimeout(function () {
                      self.loadingSave = false
                      self.$router.push('./show')
                    }, 2000)
                  }
                )
            } else {
              this.loadingSave = false
            }
          })
      },
      add_parameters (type) {
        switch (type) {
          case 'String':
            this.parameters.push(
              {
                name: '',
                maven_key: '',
                is_parameterizable: true,
                is_maven_param: true,
                default_value: '',
                type: 'string',
                description: ''
              }
            )
            break
          case 'Boolean':
            this.parameters.push(
              {
                name: '',
                maven_key: '',
                is_parameterizable: true,
                is_maven_param: true,
                default_value: '',
                type: 'boolean',
                description: ''
              }
            )
            break
          case 'Choice':
            this.parameters.push(
              {
                name: '',
                maven_key: '',
                is_parameterizable: true,
                is_maven_param: true,
                default_value: '',
                values: [],
                type: 'choice',
                description: ''
              }
            )
            break
        }
      },
      remove_parameter (index) {
        this.parameters.splice(index, 1)
      }
    }
  }
</script>

