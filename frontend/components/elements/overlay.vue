<template>
  <div class="relative">
    <div
      v-if="busy"
      class="
        flex
        absolute
        top-1/2
        left-1/2
        transform
        -translate-y-1/2 -translate-x-1/2
        items-center
        bg-white
        py-1
        px-2
        rounded
        cursor-not-allowed
        select-none
        transition
        dark:transition
        dark:bg-gray-700
      "
    >
      <icon-loading
        class="
          animate-spin
          h-5
          w-5
          text-pink-700
          mr-2
          loading-spin
          transition
          dark:transition
          dark:text-pink-600
        "
      />
      <span
        class="
          text-xs
          tracking-tight
          font-medium
          text-gray-500
          transition
          dark:transition
          dark:text-gray-300
        "
      >
        Đang "mượn" link...
      </span>
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import IconLoading from '~/assets/svg/icon-loading.svg?inline'

export default defineComponent({
  components: { IconLoading },

  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
})
</script>

<style scoped>
.loading-spin circle {
  opacity: 0.25;
}
</style>
