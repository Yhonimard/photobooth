<template>
  <div>
    <b-overlay :show="show" rounded="sm">
      <template #overlay>
        <b-spinner></b-spinner>
        <span class="ml-3 font-weight-bold" style="font-size: 30px">
          Loading Please Wait...
        </span>
      </template>
      <div
        class="wrapper text-center"
        :style="{ 'background-image': 'url(' + data.img_background + ')' }"
      >
        <div v-if="isBusy" class="text-center mb-4">
          <b-spinner variant="info" />
        </div>

        <b-card v-else no-body style="min-width: 25rem">
          <b-list-group flush>
            <b-list-group-item class="center" style="height: 75px">
              <h1
                class="font-bebas font-weight-bold m-0"
                style="font-size: 70px"
              >
                {{ data.title }}
              </h1>
            </b-list-group-item>
            <b-list-group-item class="center pb-0" style="height: 60px">
              <h4
                class="font-bebas font-weight-bold m-0"
                style="letter-spacing: 0.2rem; font-size: 35px"
              >
                {{ data.subtitle?.toUpperCase() }}
              </h4>
            </b-list-group-item>
            <b-list-group-item
              class="center pt-0"
              style="height: 50px; align-items: flex-start"
            >
              <b-dropdown text="pilih paket" class="m-md-2">
                <b-dropdown-item
                  @click="() => pakets(1, 'tidak memilih paket')"
                >
                  tidak memilih paket
                </b-dropdown-item>
                <b-dropdown-item @click="() => pakets(2, 'paket 1 2x foto')">
                  paket 1 2x foto
                </b-dropdown-item>
                <b-dropdown-item @click="() => pakets(3, 'paket 2 3x foto')"
                  >paket 2 3x foto</b-dropdown-item
                >
                <b-dropdown-item @click="() => pakets(4, 'paket 3 4x foto')">
                  paket 3 4x foto</b-dropdown-item
                >
              </b-dropdown>
              <p>
                {{
                  this.paketTitle ? this.paketTitle : "anda belum memilih paket"
                }}
              </p>

              <span class="font-bebas font-weight-bold" style="font-size: 20px">
                Harga :
                {{
                  formatMoney(data.price * this.totalPaket, {
                    symbol: "IDR ",
                    precision: 0,
                    thousand: ".",
                  })
                }}
              </span>
            </b-list-group-item>
            <b-list-group-item
              class="center p-0 mx-auto"
              style="
                height: 50px;
                background-color: #25523c;
                border-radius: 47px;
                border: 2px #000 solid;
                width: 200px;
              "
            >
              <input
                style="position: relative; z-index: 2"
                type="range"
                v-model="progressValue"
                min="0"
                max="100"
                step="1"
                class="progress"
                @change="openModalPay"
              />
              <span
                style="
                  position: absolute;
                  left: 43%;
                  top: -15%;
                  font-weight: bold;
                  z-index: 1;
                  color: #fff;
                  font-size: 35px;
                "
              >
                &raquo;
              </span>
            </b-list-group-item>
            <b-list-group-item :class="{ voucher: isVoucher }" class="pt-4">
              <img src="../assets/btn-voucher.png" @click="openModalVoucher" />
            </b-list-group-item>
          </b-list-group>
        </b-card>
        <modal-voucher @set="setVoucher" />
        <modal-payment
          @reload="openModalPay"
          :item="transaction"
          :time="time"
        />
      </div>
    </b-overlay>
  </div>
</template>

<script>
import ModalVoucher from "@/components/ModalVoucher.vue";
import ModalPayment from "@/components/ModalPayment.vue";
import { formatMoney } from "accounting-js";
import moment from "moment";
import api from "@/api";

export default {
  props: {},

  components: {
    ModalVoucher,
    ModalPayment,
  },

  data: () => ({
    data: {
      img_background: "",
      title: "WELCOME!",
      subtitle: "Wanna take a photos?",
      price: 0,
    },
    isVoucher: false,
    voucher: null,
    isBusy: true,
    progressValue: 0,
    form: {},
    interval: null,
    time: 0,
    show: false,
    totalPaket: 0,
    paketTitle: "",
  }),

  computed: {
    transaction: {
      get: function () {
        return this.$store.state.transaction;
      },
      set: function (v) {
        this.$store.commit("transaction", v);
      },
    },
    payment: {
      get: function () {
        return this.$store.state.payment;
      },
      set: function (v) {
        this.$store.commit("payment", v);
      },
    },
    activeTr() {
      const isAv =
        new Date(this.transaction.trx_expiration_time).getTime() >
        new Date().getTime();
      return this.transaction && this.transaction.trx_id && isAv;
    },
  },

  mounted() {
    this.fetchBackground();
    this.fetchVoucher();
    if (this.activeTr) {
      if (this.payment.status === "WAITING_PAYMENT") {
        this.$store.commit("allowed", true);

        clearInterval(this.interval);

        this.$router.push({ path: `/select-frame` });
      }

      this.$bvModal.show("modal-payment");
    } else {
      this.payment = {};
      this.transaction = {};
    }
    this.interval = setInterval(this.check, 3000);
  },

  methods: {
    formatMoney,
    async fetchBackground() {
      const { data } = await api.matoaphotobooth.background();
      this.data = data.sort((x, y) => y.price - x.price)[0];
      if (this.data.isDefault === "isFreePhotoBooth") {
        this.data.price = 0;
      }
      this.isBusy = false;
    },
    async fetchVoucher() {
      const { data } = await api.matoaphotobooth.voucher();
      this.voucher = data;
    },
    openModalVoucher() {
      if (!this.isVoucher) {
        this.$bvModal.show("modal-prevent-closing");
      }
    },
    async setVoucher(value) {
      const checkVoucher = this.voucher.find(
        (v) => v.code === value.toUpperCase()
      );

      if (checkVoucher) {
        if (checkVoucher.id === 6) {
          this.data.isDefault = "isFreePhotoBooth";
        }

        const disc = (this.data.price * checkVoucher.value) / 100;
        this.data.price = this.data.price - disc;
        this.$nextTick(() => {
          this.$bvToast.toast("SUCCESS ADD VOUCHER", {
            headerClass: "d-none",
            solid: true,
            variant: "success",
            toaster: "b-toaster-top-center",
          });
        });

        this.data.voucher_id = checkVoucher.id;
        this.isVoucher = true;

        this.$bvModal.hide("modal-prevent-closing");
      } else {
        this.$nextTick(() => {
          this.$bvToast.toast("VOUCHER NOT FOUND", {
            headerClass: "d-none",
            solid: true,
            variant: "danger",
            toaster: "b-toaster-top-center",
          });

          this.data.voucher_id = undefined;
          this.isVoucher = false;
        });
      }

      this.price = this.price;
    },
    async openModalPay() {
      this.show = true;
      this.transaction = {};
      this.time = 0;
      if (parseFloat(this.progressValue) > 20) {
        if (this.data.isDefault === "isFreePhotoBooth") {
          const nowDate = new Date();
          const getDate = nowDate.getDate().toString();
          const getMonth = nowDate.getMonth().toString();
          const getYear = nowDate.getFullYear().toString();
          const getHours = nowDate.getHours().toString();
          const getMinutes = nowDate.getMinutes().toString();
          const getMilliseconds = nowDate.getMilliseconds().toString();
          const str_id = `${getDate}${getMonth}${getYear}-${getHours}${getMinutes}${getMilliseconds}`;

          this.transaction = {
            trx_id: str_id,
          };

          this.$store.commit("allowed", true);
          this.$router.push({ path: `/select-frame` });
          clearInterval(this.interval);
        } else {
          const data = await api.matoaphotobooth.createTr(this.data);

          const expTime = new Date().getTime() + 300000;
          const dateExp = moment(expTime).format("YYYY-MM-DD HH:mm:ss");
          data.trx_expiration_time = dateExp;

          this.transaction = data;
          this.time = expTime;

          this.$bvModal.show("modal-payment");

          this.$nextTick(() => {
            api.matoaphotobooth.checkTr({
              partner_trx_id: data.partner_trx_id,
            });
            this.progressValue = 0;
          });
        }
      }
      this.show = false;
    },
    async check() {
      try {
        const tr = this.$store.state.transaction;
        if (tr.trx_id) {
          const { data } = await api.matoaphotobooth.checkCb(tr.trx_id);
          const payment = data;

          if (payment.status === "WAITING_PAYMENT") {
            this.$store.commit("payment", data);
            this.$store.commit("allowed", true);

            clearInterval(this.interval);

            this.$router.push({ path: `/select-frame` });
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    },

    pakets(paket, title) {
      localStorage.setItem("totalpaket", JSON.stringify(paket));

      this.paketTitle = title;
      this.totalPaket = paket;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: none;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.center {
  border: none;
  height: 75px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: none;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  height: 100vh;
  width: 100vw;
  overflow: auto;
}

.btn-voucher {
  cursor: pointer;
}

.progress {
  background-color: transparent;
  height: 200%;
  width: 100%;
  outline: none;
  transition: background 450ms ease-in;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50px;
}

input::-moz-range-thumb {
  width: 125px;
  height: 170px;
  appearance: none;
  -moz-appearance: none;
  cursor: ew-resize;
  border: none;
  background-color: transparent;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../assets/btn-slide.png");
}

.progress::-webkit-slider-thumb {
  width: 125px;
  height: 170px;
  appearance: none;
  -webkit-appearance: none;
  cursor: ew-resize;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../assets/btn-slide.png");
}
</style>
