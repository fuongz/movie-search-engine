<template>
  <div class="relative">
    <div
      v-if="busy"
      class="
        flex
        absolute
        w-full
        h-full
        top-1/2
        left-0
        pl-4
        transform
        -translate-y-1/2
        items-center
        bg-gray-200
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
          h-6
          w-6
          text-gray-400
          mr-4
          loading-spin
          transition
          dark:transition
        "
      />
      <span
        class="
          tracking-wide
          font-light font-mono
          text-gray-700
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
