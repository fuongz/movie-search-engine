<template>
  <div v-if="data" class="relative border-b border-gray-300 md:border-none">
    <div
      class="
        relative
        rounded
        hidden
        md:block
        overflow-hidden
        w-full
        movie__thumbnail
        shadow-lg
        h-72
      "
    >
      <div
        v-if="data.isMovieSeries"
        class="
          absolute
          bottom-0
          w-full
          text-center
          bg-pink-900 bg-opacity-80
          text-xs
          py-1
          text-white
          z-20
        "
      >
        Tập mới nhất - {{ data.lastEpisode }}
      </div>
      <img
        class="w-full h-full object-cover"
        :src="data.thumbnail"
        :alt="data.title"
      />
      <div
        v-if="data.url"
        class="
          absolute
          top-0
          left-0
          bg-gray-900 bg-opacity-50
          z-10
          h-full
          w-full
          movie__thumbnail-overlay
        "
      >
        <span
          class="
            absolute
            transform
            -translate-y-1/2
            top-1/2
            left-1/2
            -translate-x-1/2
            block
          "
          @click="$emit('on-play', data)"
        >
          <icon-play
            title="Watch trailer"
            class="
              text-white
              bg-transparent
              opacity-80
              cursor-pointer
              hover:opacity-100
              hover:scale-110
              hover:transition
              transition
              w-14
              fill-current
            "
          />
        </span>
      </div>
    </div>

    <h5
      class="
        text-left
        md:text-center
        font-semibold
        text-gray-600 text-sm
        tracking-tight
        md:pt-2
        line-clamp-2
        cursor-pointer
        transition
        dark:text-gray-200
        hover:text-pink-600
        hover:transition
      "
      @click.prevent="$emit('on-play', data)"
    >
      {{ data.title }}
    </h5>
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'
import IconPlay from '~/assets/svg/icon-play.svg?inline'
export default defineComponent({
  components: { IconPlay },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup() {},
})
</script>

<style lang="postcss" scoped>
.movie__thumbnail-overlay {
  @apply opacity-0 transition duration-300;
}
.movie__thumbnail:hover > .movie__thumbnail-overlay {
  @apply opacity-100 transition duration-300;
}
</style>
