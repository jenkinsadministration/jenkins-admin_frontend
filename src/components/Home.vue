<template>
  <v-container>
    <v-layout>
      <v-responsive>
        <v-container fill-height>
          <v-layout align-center class="pa-5 white" style="border-radius: 6px;">
            <v-flex>

              <v-img
                slot="offset"
                class="mx-auto d-block"
                src="/static/img/jenkins_blogbanner.gif"
              ></v-img>

              <h3 class="display-3">Jenkins Management by Code</h3>

              <span class="subheading">
                Here you save your jenkins setup, to recover your jenkins whenever you want, or simpling creating new job without too much effort.
              </span>

              <v-divider class="my-3"></v-divider>

              <div class="title mb-3">Save your time and your Jenkins!</div>

            </v-flex>
          </v-layout>
        </v-container>
      </v-responsive>
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


