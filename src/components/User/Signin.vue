<template>
  <v-container>

    <v-img
      slot="offset"
      style="position: absolute; top: 0; left: 0;"
      class="mx-auto d-block"
      width="100%"
      src="/static/img/login-top.svg"
    ></v-img>

    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <v-card class="mx-auto elevation-10" style="max-width: 500px;">
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>

                  <div class="text-xs-center">

                    <h1>Account Login</h1>

                    <v-divider></v-divider>

                    <v-img
                      slot="offset"
                      class="mx-auto d-block"
                      style="max-width: 300px;"
                      src="/static/img/jenkins_color.png"
                    ></v-img>

                    <v-btn large block color="red" dark class="mt-3"
                           :disabled="loading" :loading="loading"
                           @click.prevent="onSigninGoogle"
                    >Login with Google
                      <v-icon right dark>lock_open</v-icon>
                    </v-btn>

                    <v-divider class="mt-4"></v-divider>

                    <v-img
                      slot="offset"
                      class="mx-auto d-block mt-4"
                      style="max-width: 150px;"
                      src="/static/img/logo-pedidosya-red.svg"
                    ></v-img>

                  </div>

                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-img
      slot="offset"
      style="position: absolute; bottom: 0; left: 0;"
      class="mx-auto d-block"
      width="100%"
      src="/static/img/login-bottom.svg"
    ></v-img>

  </v-container>
</template>

<script>
  export default {
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onSigninGoogle () {
        this.$store.dispatch('signUserInGoogle')
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>
