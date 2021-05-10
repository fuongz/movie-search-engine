<template>
  <video ref="player" controls class="rounded w-full" />
</template>

<script>
import {
  defineComponent,
  onBeforeUnmount,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import Hls from 'hls.js'

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const hls = new Hls()
    const player = ref(null)

    watch(
      () => props.data,
      (val) => {
        if (val) {
          hls.loadSource(decodeURIComponent(val.url))
          hls.attachMedia(player.value)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            player.value.play()
          })
        }
      }
    )

    return { hls, player }
  },
})
</script>
