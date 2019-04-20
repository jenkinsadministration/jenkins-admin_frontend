import * as firebase from 'firebase'

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    signUserInGoogle ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((result) => {
              commit('setLoading', false)
              const newUser = {
                id: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                photoUrl: result.user.photoURL,
                authToken: result.credential.authToken
              }
              commit('setUser', newUser)
            })
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
              }
            )
        })
        .catch((error) => {
          console.error(error)
        })
    },
    autoSignIn ({commit}, user) {
      user.getIdToken(true)
        .then((authToken) => {
          commit('setUser', {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            authToken: authToken
          })
        })
        .catch((e) => (console.error(e)))
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
