<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-layout align-center row>
          <v-flex>
            <h3 class="display-3">
              Global Configuration
            </h3>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center row fill-height class="text-xs-center">
      <v-flex xs4 ma-2>
        <v-btn large block color="primary">Credentials</v-btn>
      </v-flex>
      <v-flex xs4 ma-2>
        <v-btn large block color="primary">Environment Variables</v-btn>
      </v-flex>
      <v-flex xs4 ma-2>
        <v-btn large block color="primary">Tool Configuration</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    }
  }
</script>


