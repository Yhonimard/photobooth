<template>
  <div class="wrapper">
    <div v-if="isBusy" class="text-center mb-4">
      <b-spinner variant="info" />
    </div>
    <div v-if="!isBusy" class="first-card h-100">
      <h2 class="font-bebas text-center font-weight-bold">PREVIEW FRAME</h2>
      <div class="d-flex card-height">
        <b-img-lazy
          :src="frameSelected.img_frame_left"
          alt="frame"
          style="width: auto; height: 100%"
        />
        <b-img-lazy
          :src="frameSelected.img_frame_right"
          alt="frame"
          style="width: auto; height: 100%"
        />
      </div>
    </div>
    <div v-if="!isBusy" class="second-card mx-4 h-100">
      <h2 class="font-bebas text-center font-weight-bold">SELECT FRAME</h2>
      <div class="card-height" style="background-color: transparent">
        <b-row
          class="h-100"
          style="padding: 0 16px; background-color: transparent"
        >
          <b-col
            cols="12"
            style="background-color: #25523c; border-radius: 15px"
          >
            <div v-if="!frames.length" class="text-center">
              <b-spinner v-if="busy" variant="primary" />
              <span v-else>No Data</span>
            </div>
            <ul v-else :style="gridStyle" class="card-list m-3 p-0">
              <b-overlay
                v-for="(item, p) in frames"
                :key="p"
                :show="frameSelected.name === item.name"
                variant="dark"
                opacity="0.85"
                blur="none"
              >
                <template #overlay>
                  <h4 class="text-white font-weight-bold">Selected</h4>
                </template>
                <div
                  class="d-flex"
                  style="background-color: #e9e9e9"
                  @click="onItemClick(item)"
                >
                  <b-img-lazy
                    :src="item.img_frame_left"
                    alt="frame"
                    style="width: 118px"
                    fluid
                  />
                  <b-img-lazy
                    :src="item.img_frame_right"
                    alt="frame"
                    style="width: 118px"
                    fluid
                  />
                </div>
              </b-overlay>
            </ul>
          </b-col>
        </b-row>
      </div>
    </div>
    <div
      v-if="!isBusy"
      class="ml-5 button-capture rounded-circle"
      @click="goToCamera"
    ></div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  props: {},

  components: {},

  data: () => ({
    frames: [
      {
        img_frame_left: '',
        img_frame_right: '',
      },
    ],
    frameSelected: {
      id: null,
      img_frame_left: null,
      img_frame_right: null,
    },
    isBusy: true,
  }),

  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(3, minmax(100px, 1fr))`,
      };
    },
  },

  created() {
    this.fetchFrames();
  },

  beforeCreate() {
    const asd = this.$store.state.allowed;
    if (!this.$store.state.allowed) {
      this.$router.replace('/');
    }
  },

  methods: {
    async fetchFrames() {
      const { data } = await api.matoaphotobooth.frame();
      this.frames = data;
      this.frameSelected = data[0];
      this.isBusy = false;
    },
    onItemClick(value) {
      this.frameSelected = value;
    },
    goToCamera() {
      localStorage.setItem('frame', JSON.stringify(this.frameSelected));
      this.$router.push({ path: '/camera' });
    },
  },
};
</script>

<style lang="scss" scoped>
.b-overlay-wrap {
  width: 236px;
}

.col,
.col-12 {
  padding: 0px;
}

.card-list {
  display: grid;
  grid-gap: 1em;
}

.card-height {
  height: 93.4%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #e9e9e9;
}

.card-height::-webkit-scrollbar {
  display: none;
}

.col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  width: 100%;
}

.col-height {
  height: 42%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 75px;
  height: 100vh;
  background-image: url('../assets/bg-select-frame.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.button-capture {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background-image: url('../assets/btn-capture.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
</style>
