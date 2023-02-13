<template>
  <div>
    <b-overlay :show="show">
      <template #overlay>
        <span class="font-weight-bold mr-2" style="font-size: 35px"
          >Printing</span
        >
        <img src="../assets/loading.gif" width="50" />
      </template>
      <div class="wrapper">
        <div v-if="isBusy" class="text-center mb-4">
          <b-spinner variant="info" />
        </div>
        <div v-else>
          <h2
            class="font-bebas text-center font-weight-bold mb-4"
            style="font-size: 35px"
          >
            PRINT PREVIEW
          </h2>
          <div class="d-flex">
            <div id="imgPrint" ref="imgPrint" class="d-flex card-height mr-5">
              <div id="imgCapture" ref="imgCapture" class="card-list p-0">
                <div
                  v-for="(item, i) in img"
                  :key="i"
                  class="luar"
                  style="width: 193px; height: 156px"
                >
                  <b-img-lazy
                    class="dalem"
                    :class="{
                      isGrey: filters.bw,
                      isSepia: filters.sepia,
                      isInvert: filters.invert,
                      isHueRotate: filters.backdrop,
                    }"
                    :src="item"
                    alt="frame"
                    :width="316"
                    :height="182"
                  />
                </div>
              </div>

              <div
                class="layer"
                :style="{ backgroundColor: filter.hex, opacity: 0.3 }"
              />

              <div class="frame">
                <b-img-lazy
                  id="frameLeft"
                  :src="frameSelected.img_frame_left"
                  alt="frame"
                  style="width: 194px; height: 589px"
                />
                <b-img-lazy
                  id="frameRight"
                  :src="frameSelected.img_frame_right"
                  alt="frame"
                  style="width: 194px; height: 589px"
                />
              </div>
            </div>
            <div class="card-right">
              <b-card
                body-class="p-2"
                class="text-center w-150"
                style="
                  width: 285px;
                  height: auto;
                  border: 3px #25523c solid;
                  border-radius: 25px;
                "
              >
                <h4
                  class="font-bebas font-weight-bold p-2"
                  style="letter-spacing: 0.2rem"
                >
                  SELECT FILTER
                </h4>
                <div class="color-list">
                  <b-avatar
                    v-for="(v, i) in colors"
                    :key="i"
                    button
                    :text="colorException(v) ? v.name : ''"
                    class="align-baseline mx-auto mb-2"
                    :icon="colorException(v) ? '' : 'none'"
                    :style="{
                      backgroundColor: v.hex,
                      fontSize: '0.7rem',
                      color: '#000',
                      border: '.1px solid',
                    }"
                    @click="onFilterChange(v)"
                  />
                </div>
              </b-card>

              <div
                v-if="!printed"
                class="btn-arrow w-100 d-flex justify-content-center"
              >
                <img src="../assets/giphy.gif" alt="" />
              </div>

              <div
                v-if="!printed"
                class="btn-print w-100 d-flex justify-content-center"
                @click="onPrint"
              >
                <img src="../assets/btn-print.png" width="200" />
              </div>

              <b-card
                v-if="printed"
                class="card-barcode text-center mt-3"
                style="border: 3px #25523c solid; border-radius: 25px"
              >
                <div class="mb-3" style="font-weight: 400">
                  SCAN THIS QR TO DOWNLOAD PHOTO
                </div>
                <div>
                  <qrcode-vue :value="text_qr" :size="size" level="H" />
                </div>
                <div>
                  <vac :end-time="time">
                    <span
                      slot="process"
                      slot-scope="{ timeObj }"
                      class="text-secondary"
                    >
                      Auto Redirect to Start Page ({{
                        `${timeObj.m}:${timeObj.s}`
                      }})</span
                    >
                  </vac>
                </div>
                <b-button
                  class="mt-2 px-5 py-1 text-white font-weight-bold"
                  style="background-color: #25523c"
                  @click="onStartAgain"
                >
                  START AGAIN
                </b-button>
              </b-card>
            </div>
          </div>
          <canvas class="canvas center" id="photoTaken" ref="canvas" />
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import api from "@/api";
import domtoimage from "dom-to-image";
import QrcodeVue from "qrcode.vue";

export default {
  props: {},

  components: {
    QrcodeVue,
  },

  data: () => ({
    colors: [
      {
        hex: "transparent",
        name: "None",
      },
    ],
    frameSelected: {
      img_frame_left: "",
      img_frame_right: "",
    },
    img: null,
    filter: {
      hex: "",
    },
    isBusy: true,
    imageDownload: null,
    filters: {
      bw: null,
      sepia: null,
      invert: null,
      backdrop: null,
    },
    b64str: null,
    printed: false,
    time: 0,
    show: false,
    text_qr: "",
    size: 200,
    myTimeout: null,
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
  },

  mounted() {
    this.loadPage();
  },

  methods: {
    colorException(v) {
      return (
        v.name === "None" ||
        v.name === "BW" ||
        v.name === "Sepia" ||
        v.name === "Invert" ||
        v.name === "Backdrop"
      );
    },
    async loadPage() {
      this.text_qr = `${process.env.VUE_APP_FORM_URL}/${this.transaction.trx_id}`;
      await this.fetchColor();
      await this.fetchFrames();
      await this.fetchImg();

      await this.toDataURL(this.frameSelected.img_frame_left, (dataURL) => {
        this.frameSelected.img_frame_left = dataURL;
      });
      await this.toDataURL(this.frameSelected.img_frame_right, (dataURL) => {
        this.frameSelected.img_frame_right = dataURL;
      });

      this.isBusy = false;
    },
    async fetchColor() {
      const { data } = await api.matoaphotobooth.color();
      data.reverse();
      data.map((v) => {
        this.colors.push(v);
      });
    },
    fetchFrames() {
      this.frameSelected = JSON.parse(localStorage.getItem("frame"))
        ? JSON.parse(localStorage.getItem("frame"))
        : [{ img_frame_left: "", img_frame_right: "" }];
    },
    toDataURL(src, callback) {
      let image = new Image();
      image.crossOrigin = "Anonymous";

      image.onload = () => {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.height = image.height;
        canvas.width = image.width;
        context.drawImage(image, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      };

      image.src = src;
    },
    fetchImg() {
      this.img = JSON.parse(localStorage.getItem("img"))
        ? JSON.parse(localStorage.getItem("img"))
        : [""];
      this.img.map((v) => {
        this.img.push(v);
      });
    },
    onFilterChange(data) {
      switch (data.name) {
        case "BW":
        case "Sepia":
        case "Invert":
        case "Backdrop":
          this.filter = {
            name: "None",
          };

          for (const [key, value] of Object.entries(this.filters)) {
            if (key === data.name.toLowerCase()) {
              this.filters[key] = true;
            } else {
              this.filters[key] = false;
            }
          }
          break;
        default:
          this.filter = data;
          this.filters = this.$options.data().filters;
      }
    },
    onStartAgain() {
      let isPaket = JSON.parse(localStorage.getItem("totalpaket"));

      if (isPaket) {
        if (isPaket === 1) {
          this.payment = {};
          this.transaction = {};
          this.$store.commit("allowed", false);

          localStorage.clear();
          clearTimeout(this.myTimeout);

          this.$router.push({ path: "/" });
          return;
        }
        isPaket -= 1;
        localStorage.setItem("totalpaket", JSON.stringify(isPaket));
        clearTimeout(this.myTimeout);

        this.$router.push("/select-frame");

        return;
      }
    },

    onPaketExist() {
      this.$router.push({ path: "/select-frame" });
    },

    async onPrint() {
      this.show = !this.show;
      this.time = new Date().getTime() + 120000;

      // let isPaket = JSON.parse(localStorage.getItem('totalpaket'));
      this.myTimeout = setTimeout(() => {
        this.onStartAgain();
      }, 120000);
      this.printed = true;
      const node = document.getElementById("imgPrint");

      const dataImgUrl = await domtoimage.toSvg(node).then(function (dataUrl) {
        const img = new Image();

        img.onload = () => {
          var win = window.open("", "", "height=700,width=700,top=100vh"); // Open the window. Its a popup window.
          win.document.write(
            `<div style="display:flex; justify-content:center; align-items:center; height:100%;"> ${img.outerHTML} </div>`
          ); // Write contents in the new window.
          win.print();
          win.close();
        };
        img.src = dataUrl;

        return dataUrl;
      });

      const printResult = async () => {
        const dataImg = await dataImgUrl;
        this.imageDownload = dataImg;
      };

      await printResult();

      this.svgString2Image(this.imageDownload, async (data) => {
        // this.downloadImage(data)

        const fileImg = this.dataURLtoFile(data, "matoa_photobooth.png");

        const formData = new FormData();
        formData.append("transaksi_id", this.transaction.trx_id);
        formData.append("img_data", fileImg);

        await api.matoaphotobooth.uploadImage(formData);
      });

      setTimeout(() => {
        this.show = !this.show;
      }, 30000);

      // if (isPaket) {
      //   if (isPaket === 1) {
      //     this.myTimeout = setTimeout(() => {
      //       this.onStartAgain();
      //     }, 120000);
      //     return;
      //   }
      //   setTimeout(() => {
      //     this.onPaketExist();
      //   }, 40000);

      //   isPaket -= 1;
      //   localStorage.setItem('totalpaket', JSON.stringify(isPaket));
      //   return;
      // }
    },
    svgString2Image(svgString, callback) {
      var canvas = document.createElement("canvas");
      // get canvas context for drawing on canvas
      var context = canvas.getContext("2d");
      // set canvas size
      const width = 1191;
      const height = 1701;
      canvas.width = width;
      canvas.height = height;
      // create image in memory(not in DOM)
      var image = new Image();
      let pngData = null;
      // later when image loads run this
      image.onload = function () {
        // async (happens later)
        // clear canvas
        context.clearRect(0, 0, width, height);
        // draw image with SVG data to canvas
        context.drawImage(image, 0, 0, width, height);
        // snapshot canvas as png
        pngData = canvas.toDataURL("image/png");
        // pass png data URL to callback
        callback(pngData);
      }; // end async
      // start loading SVG data into in memory image
      image.src = svgString;
    },
    downloadImage(data) {
      const link = document.createElement("a");
      link.href = data;
      link.download = "";
      link.click();
    },
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-print {
  margin-top: -130px;
}

.btn-arrow {
  margin-top: -50px;
}

.luar {
  position: relative;
  overflow: hidden;
}

.dalem {
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
  right: -9999px !important;
  bottom: -9999px !important;
  margin: auto !important;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100vh;
  background-image: url("../assets/bg-print.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.card-height {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  position: relative;
  background-color: transparent;
}

.col,
.col-2,
.col-3,
.col-6 {
  padding: 0 16px;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.frame {
  position: relative;
}

.card-list {
  width: 100%;
  height: 100%;
  padding: 47px 0 36px 0 !important;
  display: grid;
  grid-gap: 0em;
  position: absolute;
  z-index: 0;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
}

.color-list {
  margin-left: auto;
  margin-right: auto;
  width: 215px;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(5, minmax(0px, 1fr));
}

.canvas {
  width: 100%;
  height: 100%;
  display: none;
}

.card-right {
  height: 100%;
  position: relative;
}

.bt-print {
  width: 100%;
  height: 45px;
  position: relative;
  font-size: 16px;
}

.isGrey {
  filter: grayscale(100%);
}

.isSepia {
  filter: sepia(100%);
}

.isInvert {
  filter: invert(100%);
}

.isHueRotate {
  filter: hue-rotate(90deg);
}
</style>
