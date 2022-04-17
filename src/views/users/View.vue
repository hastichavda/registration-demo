<template>
  <div>
    <v-card>
      <v-card-title class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$router.push('/')"
        >
          Back to users
        </button>
      </v-card-title>
      <v-card v-if="selectedUser" class="mx-auto my-12" max-width="800">
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-img height="250" :src="selectedUser.image"></v-img>

        <v-card-title>{{ selectedUser.name }}</v-card-title>
        <v-card-title>{{ selectedUser.email }}</v-card-title>
        <v-card-title>{{ selectedUser.mobile }}</v-card-title>

        <v-card-text>
          <div>
            {{ selectedUser.address }}
          </div>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      selectedUser: null,
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      axios
        .get(`http://localhost:3000/users/${this.$route.params.id}`)
        .then((res) => {
          this.selectedUser = res.data
        })
    },
  },
}
</script>
