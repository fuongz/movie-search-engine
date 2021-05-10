<template>
  <video
    ref="playerRef"
    class="video-js vjs-default-skin rounded w-full md:min-h-20"
  />
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import videojs from 'video.js'

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const playerRef = ref(null)
    const player = ref(null)
    const { $device } = useContext()
    const options = {
      autoplay: true,
      fluid: true,
      controls: true,
      preload: 'true',
      playbackRates: [0.5, 1, 1.5, 2, 4],
    }

    watch(
      () => props.data,
      (val) => {
        if (val) {
          player.value = videojs(playerRef.value, options)
          player.value.src({
            src: decodeURIComponent(val.url),
            type: 'application/x-mpegURL',
          })
          player.value.play()

          if ($device.isMobileOrTablet) {
            player.value.requestFullscreen()
          }
        }
      }
    )

    return { player, playerRef }
  },
})
</script>

<style>
@import 'video.js/dist/video-js.css';
</style>
