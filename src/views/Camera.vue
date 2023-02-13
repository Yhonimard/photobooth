<template>
  <div
    id="app"
    class="wrapper"
  >
    <div
      class="camera-box"
      :class="{ 'flash' : isShotPhoto }"
    >
      <div
        class="camera-shutter"
        :class="{'flash' : isShotPhoto}"
      />

      <div
        style="width: 23.5%; height: 100%; background-color: #000; z-index: 3; position: absolute; opacity: .93;"
      />

      <div
        style="width: 23.5%; height: 100%; background-color: #000; z-index: 3; right: 0; position: absolute; opacity: .93;"
      />

      <div
        style="width: 100%; height: 10%; background-color: black; z-index: 3; right: 0; position: absolute; opacity: 1;"
      />

      <div
        style="width: 100%; height: 10%; background-color: black; z-index: 3; bottom: 0; position: absolute; opacity: 1;"
      />
      
      <video
        class="camera"
        ref="camera"
        autoplay
      />
    
      <canvas
        class="canvas"
        id="photoTaken"
        ref="canvas"
        :width="1330"
        :height="760"
      />

      <div class="img-preview">
        <b-img
          class="ml-3"
          v-for="(item, i) in img"
          :key="i"
          :src="item"
          :width="266"
          :height="152"
        />
      </div>
    </div>
    <div
      v-if="!isPhotoTaken"
      class="timer"
    >
      {{ prettyTime }}
    </div>
    <div
      v-if="isCameraOpen && !isLoading"
      class="camera-shoot"
    >
      <button
        v-if="isCapture"
        class="capture"
        @click="takePhoto"
      >
        <img src="../assets/btn-camera.png" style="height: 170px;">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isCameraOpen: true,
    isPhotoTaken: false,
    isShotPhoto: false,
    isLoading: false,
    link: '#',
    time: 5,
    timer: null,
    isRunning: false,
    img: [],
    isDone: false,
    isCapture: true
  }),
  computed: {
    prettyTime() {
      const secondes = Math.round(this.time)
      return secondes
    }
  },
  created() {
    this.createCameraElement()
  },
  methods: {
    createCameraElement() {
      this.isLoading = true
      
      const constraints = (window.constraints = {
        audio: false,
        video: true
      })


      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.isLoading = false
          this.$refs.camera.srcObject = stream
        })
        .catch(() => {
          this.isLoading = false
          alert('May the browser didn\'t support or there is some errors.')
        })
    },
    
    takePhoto() {
      this.isCapture = false
      if (this.img.length < 3) {
        this.isPhotoTaken = false

        this.timer = setInterval( () => {
          this.isRunning = true
          if (this.time > 0) {
            this.time--
          } else {
            clearInterval(this.timer)
          }
        }, 1000)
      
        setTimeout(() => {
          this.isPhotoTaken = true
      
          const context = this.$refs.canvas.getContext('2d')
          context.drawImage(this.$refs.camera, 0, 0, 1330, 760)
          const canvas = document.getElementById('photoTaken').toDataURL('image/jpeg')
          this.img.push(canvas)

          this.time = 5
          clearInterval(this.timer)
          this.timer = null

          this.isShotPhoto = true
          const FLASH_TIMEOUT = 50

          setTimeout(() => {
            this.isShotPhoto = false
          }, FLASH_TIMEOUT)
          
          this.takePhoto()

          if (this.img.length === 3) {
            setTimeout(() => {
              localStorage.setItem('img', JSON.stringify(this.img))
              this.$router.push({ path: '/print' })
            }, 3000)
          }
        }, 5000)
      } else {
        this.isDone = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
  overflow: hidden;

  .camera {
    height: 100vh;
    width: 100vw;
  }

  .img-preview {
    display: flex;
    position: absolute;
    justify-content: center;
    top: 73%;
    width: 100%;
    z-index: 2;
  }

  .canvas {
    display: none;
    position: absolute;
    top: 75%;
    right: 10%;
    z-index: 2;
  }

  .camera-box {   
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: "FlipH"; 
  
    .camera-shutter {
      opacity: 0;
      width: 100vw;
      height: 100vh;
      background-color: #fff;
      position: absolute;
      
      &.flash {
        opacity: 1;
      }
    }
  }

  .timer {
    position: absolute;
    top: 16%;
    left: 44%;
    font-size: 20rem;
    color: rgba(255, 255, 255, 0.2);
  }
  
  .camera-shoot {
    margin: 1rem 0;

    button {
      position: absolute;
      height: 300px;
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      top: 55%;
      left: 44%;
      
      &.capture {
        background-color: transparent;
        border: none;
      }

      img {
        height: 100px;
        object-fit: cover;
      }
    }
  }
  
  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;
    
    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }
    
    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;
      
      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;
        
        &:nth-child(2) {
          animation-delay: .2s;
        }
        
        &:nth-child(3) {
          animation-delay: .4s;
        }
      }
    }
  }

  @keyframes preload {
    0% {
      opacity: 1
    }
    50% {
      opacity: .4
    }
    100% {
      opacity: 1
    }
  }
}
</style>
