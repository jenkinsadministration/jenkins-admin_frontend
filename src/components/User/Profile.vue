<template>
  <v-container>
    <v-layout>

      <v-flex xs12 sm6 offset-sm3>
        <v-card class="v-card-profile" style="margin-top: 200px">

          <v-card-text class="text-xs-center">

            <v-img
              slot="offset"
              class="mx-auto d-block elevation-5"
              size="300px"
              style="margin-top: -150px; height: 300px; width: 300px; border-radius: 50%;"
              :src="user.photoUrl"
            >
            </v-img>
            <h1 class="card-title font-weight-light mt-3">{{ user.name }}</h1>
            <h3 class="category text-gray font-weight-thin mb-3 mt-2">{{ user.email }}</h3>
            <p class="card-description font-weight-light">

            </p>
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
      }
    }
  }
</script>
