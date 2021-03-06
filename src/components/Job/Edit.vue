<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-xl>
    <v-layout align-center row>
      <v-flex>
        <h3 class="display-3">Edit Job</h3>
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

          <v-btn to="/projects">Back</v-btn>
          <v-btn @click="submit"
                 class="secondary"
                 :disabled="$validator.errors.count() > 0 || loadingSave"
                 :loading="loadingSave"
          >
            <v-icon left dark>save</v-icon>
            Save
          </v-btn>

          <v-divider class="mt-4 mb-3"></v-divider>

          <v-card>
            <v-card-text>
              <div class="headline mb-3">General Information</div>

              <v-text-field
                v-model="job.full_name"
                label="Path"
                :success="true"
              ></v-text-field>

              <v-select
                v-model="job.setup.template"
                :items="get_template()"
                label="Template"
                :success="true"
              ></v-select>

              <v-text-field
                v-model="job.platform"
                label="Platform"
                readonly
                :success="true"
              ></v-text-field>

              <v-text-field
                v-if="job.browser && job.browser !== job.platform"
                v-model="job.browser"
                label="Browser"
                readonly
                :success="true"
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <div class="headline mb-3">Source Code Management</div>

              <v-text-field
                v-model="job.setup.repository"
                v-validate="'required'"
                :error-messages="errors.collect('repository')"
                label="Repository"
                data-vv-name="repository"
                required
                :success="errors.collect('repository').length < 1"
              ></v-text-field>

              <v-text-field
                v-model="job.setup.branch"
                :error-messages="errors.collect('branch')"
                label="Branch"
                data-vv-name="branch"
                :success="errors.collect('branch').length < 1"
                hint="Leave blank to config a custom branch setup"
                persistent-hint
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <div class="headline mb-3">Run Setup</div>

              <v-text-field
                v-model="job.setup.cron.build"
                :error-messages="errors.collect('cron_build')"
                label="Build Cron"
                data-vv-name="cron_build"
                required
                :success="errors.collect('cron_build').length < 1"
              ></v-text-field>

              <v-text-field
                v-model="job.setup.cron.poll_scm"
                :error-messages="errors.collect('cron_poll_scm')"
                label="Poll SCM Cron"
                data-vv-name="cron_poll_scm"
                required
                :success="errors.collect('cron_poll_scm').length < 1"
              ></v-text-field>

              <v-text-field
                v-model="job.setup.log_rotate"
                type="number"
                min="-1"
                step="1"
                v-validate="'required'"
                :error-messages="errors.collect('log_rotate')"
                label="Max Builds to Save"
                data-vv-name="log_rotate"
                required
                :success="errors.collect('log_rotate').length < 1"
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <div class="headline mb-3">Slack</div>

              <v-text-field
                v-model="job.setup.slack_channel"
                :error-messages="errors.collect('slack_channel')"
                label="Slack Channel"
                data-vv-name="Slack Channel"
                required
                :success="errors.collect('slack_channel').length < 1"
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4" v-if="job.type === 'BUILD'">
            <v-card-text>
              <div class="headline mb-3">Job of Tests</div>

              <v-text-field
                v-model="job.setup.job_of_test"
                label="Job of Tests"
                success
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4" v-if="job.type === 'BUILD'">
            <v-card-text>
              <div class="headline mb-3">Build Extension</div>

              <v-select
                v-model="job.setup.app_extension"
                :items="get_ios_app_extension()"
                label="Build Extension"
                :success="true"
              ></v-select>

            </v-card-text>
          </v-card>

          <v-card class="mt-4" v-if="job.type === 'BUILD'">

            <v-card-text>
              <div class="headline mb-3">Peya Apps</div>

              <v-text-field
                v-model="job.setup.peya_app_id"
                label="Peya App Id"
                success
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <div class="headline mb-3">Athenea</div>

              <v-text-field
                v-model="job.setup.athenea_project.project_id"
                :error-messages="errors.collect('athenea_project_project_id')"
                label="Project Id"
                data-vv-name="Project Id"
                required
                :success="errors.collect('athenea_project_project_id').length < 1"
              ></v-text-field>

              <v-text-field
                v-model="job.setup.athenea_project.environment_id"
                :error-messages="errors.collect('athenea_project_environment_id')"
                label="Environment_Id"
                data-vv-name="Environment Id"
                required
                :success="errors.collect('athenea_project_environment_id').length < 1"
              ></v-text-field>

            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>

              <div class="headline mb-3">Default Parameters</div>

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

              <div>
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

                    <v-textarea
                      v-if="param.type === 'text'"
                      v-model="param.default_value"
                      label="Default Value"
                      :success="errors.collect('default_value').length < 1"
                    ></v-textarea>

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

              </div>

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

          <v-card class="mt-4" v-if="false">
            <v-card-text>
              <div class="headline mb-3">Athenea</div>
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
          athenea_project: {
            environment_id: '',
            project_id: ''
          },
          slack_channel: '',
          job_of_test: '',
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
          name: 'Text'
        },
        {
          name: 'Choice'
        }
      ],
      dictionary: {
        custom: {
          full_name: {
            required: 'Path can not be empty'
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
          } else {
            this.parameters = this.job.setup.parameters
          }
          if (!this.job.setup.hasOwnProperty('slack_channel')) {
            this.job.setup['slack_channel'] = ''
          }
          if (!this.job.setup.hasOwnProperty('job_of_test')) {
            this.job.setup['job_of_test'] = ''
          }
          if (!this.job.setup.hasOwnProperty('athenea_project')) {
            this.job.setup['athenea_project'] = {
              environment_id: '',
              project_id: ''
            }
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
              this.job.setup.parameters = this.parameters
              axios
                .put(
                  process.env.API_URI + '/projects/' + this.projectId + '/jobs/' + this.type + '/' + this.id,
                  this.job,
                  {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
                )
                .then(
                  () => {
                    this.loadingSave = false
                    this.$router.push('.')
                  }
                )
            } else {
              this.loadingSave = false
            }
          })
      },
      get_ios_app_extension () {
        switch (this.job.platform) {
          case 'iOS':
            return ['.app', '.ipa']
          case 'Android':
            return ['.apk']
          default:
            return []
        }
      },
      get_template () {
        if (this.job.type === 'TEST') {
          return ['test_template.xml']
        } else {
          switch (this.job.platform) {
            case 'iOS':
              return [
                'build_ios_pedidosya_template.xml', 'build_ios_pedidosya_custom_branch_template.xml',
                'build_ios_domicilio_template.xml', 'build_ios_domicilio_custom_branch_template.xml',
                'build_ios_apetito24_template.xml', 'build_ios_apetito24_custom_branch_template.xml',
                'build_ios_app_release.xml', 'build_ios_app_release_by_squad.xml', 'build_ios_pr_checker.xml'
              ]
            case 'Android':
              return [
                'build_android_pedidosya_template.xml', 'build_android_pedidosya_custom_branch_template.xml',
                'build_android_domicilio_template.xml', 'build_android_domicilio_custom_branch_template.xml',
                'build_android_apetito24_template.xml', 'build_android_apetito24_custom_branch_template.xml',
                'build_android_app_release.xml', 'build_android_app_release_by_squad.xml', 'build_android_pr_checker.xml'
              ]
            case 'Web':
              return [
                'build_web_template.xml'
              ]
            default:
              return
          }
        }
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
          case 'Text':
            this.parameters.push(
              {
                name: '',
                maven_key: '',
                is_parameterizable: true,
                is_maven_param: true,
                default_value: '',
                type: 'text',
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

