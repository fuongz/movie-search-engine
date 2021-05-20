<template>
  <div>
    <div
      class="
        fixed
        z-50
        transition-all
        duration-500
        right-8
        cursor-pointer
        light-bulb
        top-0
      "
      :class="{
        '-top-44 hover:-top-40': !showColorPreference && !$device.isMobile,
        '-top-42 -right-2': $device.isMobile,
      }"
      @click.prevent.stop="
        $colorMode.preference =
          $colorMode.preference === 'dark' ? 'light' : 'dark'
      "
    >
      <icon-moon
        v-if="$colorMode.preference !== 'dark'"
        class="w-12 relative top-40"
      />
      <icon-sun v-else class="w-12 relative top-40" />
    </div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from '@nuxtjs/composition-api'
import IconSun from '~/assets/svg/icon-sun.svg?inline'
import IconMoon from '~/assets/svg/icon-moon.svg?inline'

export default defineComponent({
  components: { IconSun, IconMoon },

  setup(): any {
    const showColorPreference = ref<boolean>(false)

    onBeforeMount((): void => {
      document.addEventListener('scroll', colorPreference)
    })

    // Show colorPreference
    const colorPreference = (): void => {
      const scrollY = window.scrollY || window.pageYOffset
      const $element = document.querySelector('#logo')

      if ($element) {
        const elementPosition =
          $element.getBoundingClientRect().top + scrollY + $element.clientHeight

        if (scrollY > elementPosition - 50) {
          showColorPreference.value = true
        } else {
          showColorPreference.value = false
        }
      }
    }

    return {
      showColorPreference,
    }
  },
})
</script>

<style lang="postcss" scoped>
.light-bulb::before {
  @apply absolute bg-gray-200 top-0 left-1/2;
  content: '';
  width: 1px;
  height: 160px;
}
</style>
