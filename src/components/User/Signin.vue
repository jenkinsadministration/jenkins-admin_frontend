<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <v-card class="mx-auto" style="max-width: 500px;">
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
                      width="300px"
                      src="/static/img/jenkins_color.png"
                    ></v-img>

                    <v-btn large block color="red" dark class="mt-3"
                           :disabled="loading" :loading="loading"
                           @click.prevent="onSigninGoogle"
                    >Login with Google
                      <v-icon right dark>lock_open</v-icon>
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                       </span>
                    </v-btn>
                  </div>

                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
