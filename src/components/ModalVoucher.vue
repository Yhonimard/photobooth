<template>
  <b-modal
    id="modal-prevent-closing"
    ref="modal"
    title="Apply Voucher"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    centered
    ok-variant="ok"
    cancel-variant="cancel"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
    >
      <b-form-group
        class="m-0"
        label-for="voucher-input"
        invalid-feedback="Voucher is required"
        :state="voucherState"
      >
        <b-form-input
          id="voucher-input"
          v-model="voucher"
          placeholder="Input Your Voucher"
          :state="voucherState"
          required
          style="text-transform: uppercase;"
        />
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {},

  components: {},

  data: () => ({
    voucher: '',
    voucherState: null
  }),

  computed: {},

  mounted() {},

  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.voucherState = valid
      return valid
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      
      // Hide the modal manually
      this.$nextTick(() => {
        this.$emit('set', this.voucher)
        this.resetModal()
      })
    },
    resetModal() {
      this.voucher = this.$options.data().voucher
      this.voucherState = this.$options.data().voucherState
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    }
  }
}
</script>

<style lang="scss">
.btn-ok, .btn-ok:hover {
  color: #fff;
  background-color: #25523c;
  border-color: #25523c;
  padding-left: 25px;
  padding-right: 25px;
  margin-left: 10px;
}

.btn-cancel, .btn-cancel:hover {
  color: #fff;
  background-color: #c82333;
  border-color: #c82333;
}
</style>
