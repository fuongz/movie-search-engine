<template>
  <div v-if="data" class="relative pb-16">
    <div class="relative w-full h-72 movie__thumbnail">
      <img
        class="w-full h-full object-cover shadow"
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

    <h5 class="font-medium text-sm tracking-tight pt-4 line-clamp-2">
      {{ data.title }}
    </h5>

    <div class="absolute bottom-0 w-full">
      <button
        class="
          cursor-pointer
          block
          mt-4
          w-full
          rounded-sm
          text-sm
          font-medium
          px-4
          py-2
          outline-none
          bg-pink-100
          text-pink-600
          border-none
          transition
          hover:bg-pink-700
          hover:text-white
          hover:transition
          focus:outline-none
        "
        @click.prevent="$emit('on-play', data)"
      >
        Xem phim
      </button>
    </div>
  </div>
</template>
<script lang="ts">
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
