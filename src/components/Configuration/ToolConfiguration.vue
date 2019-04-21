<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>

    <v-layout row wrap>
      <v-flex xs12 sm12 md12>

        <v-layout align-center row>
          <v-flex>
            <h3 class="display-3">
              Tool Configurations
              <v-dialog v-model="dialog" persistent max-width="500px">
                <template v-slot:activator="{ on }">

                  <v-btn
                    fab
                    right
                    color="secondary"
                    style="float: right; top: 10px;"
                    v-on="on"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <v-card class="theme--dark">
                  <v-card-title class="primary">
                    <span class="headline theme--dark">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text class="white">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                      v-validate="'required'"
                      :error-messages="errors.collect('name')"
                      data-vv-name="name"
                      required
                      :success="errors.collect('name').length < 1"
                    >
                    </v-text-field>
                  </v-card-text>

                  <v-card-actions class="grey lighten-4" v-if="!loadingSave">
                    <v-btn color="secondary" flat @click="close">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" depressed @click="save">Save</v-btn>
                  </v-card-actions>
                  <v-card-actions class="grey lighten-4" v-if="loadingSave">
                    <v-layout row mt-3 justify-space-between>
                      <v-progress-linear :indeterminate="true"></v-progress-linear>
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </h3>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <v-layout row mt-3 justify-space-between v-if="loadingScreen">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-layout>

        <v-alert :value="true" color="info" icon="info" outline v-if="!loadingScreen && toolConfigurations.length === 0">
          No tool configurations found. Try creating a new one.
        </v-alert>

        <v-layout row mt-3 v-if="!loadingScreen && toolConfigurations.length > 0">
          <v-flex>
            <div>

              <v-card>
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>

                <v-data-table
                  :headers="headers"
                  :items="toolConfigurations"
                  :search="search"
                  class="container"
                  :rows-per-page-items="[50]"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.data.name }}</td>
                    <td class="justify-center layout px-0">
                      <v-btn
                        icon
                        depressed
                        color="info"
                        class="mr-2"
                        @click="editItem(props.item)">
                        <v-icon>
                          edit
                        </v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        depressed
                        color="error"
                        class="mr-2"
                        @click="deleteItem(props.item)"
                      >
                        <v-icon>
                          delete
                        </v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <template v-slot:no-data>
                    <v-alert :value="true" color="info" icon="info" outline>
                      No tool configurations found. Try creating a new one.
                    </v-alert>
                  </template>
                </v-data-table>
              </v-card>
            </div>
          </v-flex>
        </v-layout>

        <v-divider class="mt-4 mb-3"></v-divider>

        <v-btn to="/configuration">Back</v-btn>

      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogDelete" persistent width="500">
      <v-card>
        <v-card-title class="headline darken-3 error white--text" primary-title>
          Delete Project
        </v-card-title>

        <v-card-text class="text-xs-center">
          Are you sure that you want to delete the tool configuration «{{editedItem.name}}»?
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
            @click="confirmDelete()"
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
        loadingDelete: false,
        loadingSave: false,
        projectNameToDelete: null,
        projects: [],
        dialogDelete: false,
        dialog: false,
        search: '',
        headers: [
          {
            text: 'Name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'Actions',
            value: 'data.name',
            align: 'center',
            width: '104',
            sortable: false
          }
        ],
        toolConfigurations: [],
        selectedId: '',
        editedIndex: -1,
        editedItem: {
          name: ''
        },
        defaultItem: {
          name: ''
        }
      }
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Tool Configuration' : 'Edit Tool Configuration'
      },
      user () {
        return this.$store.getters.user
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(
          process.env.API_URI + '/tool_configurations',
          {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
        )
          .then(toolConfigurations => {
            this.toolConfigurations = toolConfigurations.data
            this.loadingScreen = false
          })
      },

      editItem (item) {
        this.editedIndex = this.toolConfigurations.indexOf(item)
        this.editedItem = Object.assign({}, item.data)
        this.selectedId = item.id
        this.dialog = true
      },

      deleteItem (item) {
        this.editedItem = Object.assign({}, item.data)
        this.editedIndex = this.toolConfigurations.indexOf(item)
        this.selectedId = item.id
        this.dialogDelete = true
      },

      confirmDelete () {
        this.loadingDelete = true
        axios
          .delete(
            process.env.API_URI + '/tool_configurations/' + this.selectedId,
            {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
          )
          .then(
            () => {
              self.loadingDelete = false
              this.dialogDelete = false
              this.toolConfigurations.splice(this.editedIndex, 1)
            }
          )
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        this.$validator.validateAll()
          .then((value) => {
            if (value) {
              this.loadingSave = true
              if (this.editedIndex > -1) {
                axios
                  .put(
                    process.env.API_URI + '/tool_configurations/' + this.selectedId,
                    this.editedItem,
                    {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
                  )
                  .then(
                    (toolConfiguration) => {
                      this.toolConfigurations[this.editedIndex].data = toolConfiguration.data.data
                      this.loadingSave = false
                      this.close()
                    }
                  )
              } else {
                axios
                  .post(
                    process.env.API_URI + '/tool_configurations',
                    this.editedItem,
                    {headers: {'Authorization': 'Bearer ' + this.user.authToken}}
                  )
                  .then(
                    (toolConfiguration) => {
                      this.toolConfigurations.push(toolConfiguration.data)
                      this.loadingSave = false
                      this.close()
                    }
                  )
              }
            }
          })
      }
    }
  }
</script>

