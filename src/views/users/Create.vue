<template>
  <div>
    <v-card class="px-4 py-2 mx-4" max-width="900">
      <v-card-title>
        <div class="flex justify-between">
          <span> User Create </span>
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="$router.push('/')"
          >
            Back to users
          </button>
        </div>
      </v-card-title>

      <form action="" @submit.prevent="submitUserData">
        <div
          class="flex w-64 justify-center px-6 pt-5 pb-6 mt-2 border-2 border-gray-300 border-dashed rounded-md mb-7"
        >
          <div class="space-y-1 text-center">
            <svg
              v-if="!previewImage"
              class="w-12 h-12 mx-auto text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="file-upload"
                class="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span v-if="!previewImage">Upload a file</span>
                <input
                  id="file-upload"
                  name="image"
                  type="file"
                  class="sr-only"
                  @change="uploadImage"
                />
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt=""
                  class="w-20 h-20"
                />
                <span v-if="previewImage" @click="removeImage">remove</span>
              </label>
              <p v-if="!previewImage" class="pl-1">or drag and drop</p>
            </div>
            <p v-if="!previewImage" class="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
        <v-text-field
          v-model="formData.name"
          :error-messages="nameErrors"
          label="Name"
          required
          outlined
          dense
          @input="$v.formData.name.$touch()"
          @blur="$v.formData.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="formData.email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          outlined
          dense
          @input="$v.formData.email.$touch()"
          @blur="$v.formData.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="formData.mobile"
          :error-messages="mobileErrors"
          label="Mobile"
          required
          outlined
          dense
          @input="$v.formData.email.$touch()"
          @blur="$v.formData.email.$touch()"
        ></v-text-field>

        <div id="geocoder" class="mb-8"></div>
        <pre id="result" ref="result" class="hidden"></pre>

        <button
          type="submit"
          class="inline-flex items-center px-4 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </v-card>
  </div>
</template>
<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [validationMixin],

  data() {
    return {
      previewImage: '',
      formData: {
        id: null,
        image: '',
        name: '',
        email: '',
        mobile: '',
        coordinates: '',
        address: '',
      },
    }
  },

  validations: {
    formData: {
      name: { required },
      email: { required, email },
      mobile: { required },
    },
  },

  computed: {
    ...mapGetters(['getSelectedUser']),
    nameErrors() {
      const errors = []
      if (!this.$v.formData.name.$dirty) return errors
      !this.$v.formData.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.formData.email.$dirty) return errors
      !this.$v.formData.email.email && errors.push('Must be valid e-mail')
      !this.$v.formData.email.required && errors.push('E-mail is required')
      return errors
    },
    mobileErrors() {
      const errors = []
      if (!this.$v.formData.mobile.$dirty) return errors
      !this.$v.formData.mobile.required && errors.push('Mobile is required')
      return errors
    },
  },

  mounted() {
    this.initAddress()
    if (this.$route.params.id) {
      this.getUserData()
    }
  },

  methods: {
    ...mapActions(['addUser', 'updateUser']),

    getUserData() {
      axios
        .get(`http://localhost:3000/users/${this.$route.params.id}`)
        .then((response) => {
          if (response) {
            this.previewImage = response.data.image
            this.formData.image = response.data.image
            this.formData.name = response.data.name
            this.formData.email = response.data.email
            this.formData.mobile = response.data.mobile
            this.formData.address = response.data.address
            this.formData.coordinates = response.data.coordinates
          }
        })
    },

    uploadImage(event) {
      const input = event.target
      if (input.files) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.previewImage = e.target.result
          this.formData.image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },

    removeImage() {
      this.previewImage = ''
      this.formData.image = ''
    },

    initAddress() {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiaGFzaWkiLCJhIjoiY2wwYWt4cjJ1MDF4YTNjbWptNzZwM2ZhZyJ9.9WUVDkgiL5lsqX95u0VAvA'

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood',
      })

      geocoder.addTo('#geocoder')

      // Get the geocoder results container.
      const results = document.getElementById('result')

      // Add geocoder result to container.
      geocoder.on('result', (e) => {
        results.innerText = JSON.stringify(e.result, null, 2)
        this.formData.coordinates = e.result.geometry.coordinates
        this.formData.address = e.result.place_name
      })

      // Clear results container when search is cleared.
      geocoder.on('clear', () => {
        results.innerText = ''
      })
    },

    submitUserData() {
      this.$v.$touch()
      if (this.$route.params.id) {
        this.updateUser({
          id: this.$route.params.id,
          data: this.formData,
        }).then(() => {
          this.$toastr.s('User updated successfully')
          this.$router.push('/')
        })
      } else {
        this.addUser(this.formData).then(() => {
          this.$toastr.s('User added successfully')
          this.$router.push('/')
        })
      }
    },
  },
}
</script>

<style>
.mapboxgl-ctrl-geocoder.mapboxgl-ctrl {
  width: 100%;
  max-width: 900px;
  border: 1px solid gray;
}
</style>
