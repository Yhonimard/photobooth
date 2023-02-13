<template>
  <b-card class="card-form">
    <h5>Form Download Photo</h5>
    <div class="my-3">*Isi data dibawah dengan benar agar foto dapat terkirim!</div>
    <validation-observer ref="form" slim>
      <validation-provider
        name="Name"
        rules="required|max:50"
        v-slot="{ errors }"
      >
        <b-form-group
          label="Name"
          label-class="font-weight-bold"
          :invalid-feedback="errors[0]"
        >
          <b-form-input
            trim
            autocapitalize="off"
            autocomplete="off"
            v-model="form.name"
            placeholder="Name"
            :disabled="busy"
            :class="{ 'is-invalid': errors.length }"
          />
        </b-form-group>
      </validation-provider>
      <validation-provider
        name="Email"
        rules="required|email|max:30"
        v-slot="{ errors }"
      >
        <b-form-group
          label="Email"
          label-class="font-weight-bold"
          :invalid-feedback="errors[0]"
        >
          <b-form-input
            trim
            autocapitalize="off"
            autocomplete="off"
            v-model="form.email"
            placeholder="Active Email"
            type="email"
            :disabled="busy"
            :class="{ 'is-invalid': errors.length }"
          />
        </b-form-group>
      </validation-provider>
      <validation-provider
        name="Phone"
        rules="required|max:13"
        v-slot="{ errors }"
      >
        <b-form-group
          label="Phone"
          label-class="font-weight-bold"
          :invalid-feedback="errors[0]"
        >
          <b-form-input
            trim
            autocapitalize="off"
            autocomplete="off"
            v-model="form.phone"
            placeholder="Active Phone Number"
            type="number"
            :disabled="busy"
            :class="{ 'is-invalid': errors.length }"
          />
        </b-form-group>
      </validation-provider>
      <validation-provider
        name="Kritik dan Saran"
        rules="required|min:5|max:255"
        v-slot="{ errors }"
      >
        <b-form-group
          label="Kritik dan Saran"
          label-class="font-weight-bold"
          :invalid-feedback="errors[0]"
        >
          <b-form-textarea
            id="textarea"
            v-model="form.kritik_saran"
            placeholder="Kritik dan Saran"
            rows="6"
            no-resize
            :disabled="busy"
            :class="{ 'is-invalid': errors.length }"
          />
        </b-form-group>
      </validation-provider>
    </validation-observer>
    <b-alert :show="terkirim" variant="success">Success! Tunggu 2-3 menit hingga foto terkirim ke email anda.</b-alert>
    <div class="d-flex justify-content-center mt-5">
      <b-button
        variant="success"
        @click="uploadInfo"
        :disabled="uploading"
      >
        <b-spinner v-show="loading" small></b-spinner>
        Submit
      </b-button>
    </div>
  </b-card>
</template>

<script>
import api from '@/api'

export default {
  props: {},

  components: {},

  data: () => ({
    form: {
      name: null,
      email: null,
      phone: null,
      kritik_saran: null,
    },
    busy: false,
    uploading: false,
    loading: false,
    terkirim: false
  }),

  computed: {},

  mounted() {},

  methods: {
    async uploadInfo() {
      try {
        this.uploading = true
        this.loading = true

        const valid = await this.$refs.form.validate()
        if (!valid) {
          this.uploading = false
          this.loading = false
          return false
        }
        const formData = new FormData()
        formData.append('image_print_id', this.$route.params.id)
        formData.append('transaksi_id', this.$route.params.id)
        Object.keys(this.form).forEach(key => {
          if (this.form[key]) {
            formData.append(key, this.form[key])
          }
        });

        await api.matoaphotobooth.saveInfo(formData)

        this.$nextTick(() => {
          this.terkirim = true
          this.uploading = false
          this.loading = false
        });
      } catch (error) {
        this.uploading = false
        this.loading = false
        console.log('error', error)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.card-form {
  height: 100vh;
  width: 100%;
  margin: auto;
  align-content: center;
}
</style>
