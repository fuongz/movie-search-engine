<template>
  <p
    class="
      mt-2
      text-sm text-left
      px-4
      py-2
      bg-pink-50
      rounded
      text-pink-600
      border border-pink-200
      transition
      dark:transition
      dark:bg-gray-900
      dark:text-pink-700
      dark:border-pink-900
    "
  >
    <span class="font-semibold tracking-tight mr-2">📢</span>
    {{ inspire }}
  </p>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const inspires = [
      'Tìm phim lẻ thì viết kiểu "conan tập 1000".',
      'Hiện tại mình chỉ lấy từ 01 nguồn phim là "phephimz(.)net"',
    ]

    const inspire = ref<string>(
      inspires[Math.floor(Math.random() * inspires.length)]
    )

    setInterval(() => {
      inspire.value = inspires[Math.floor(Math.random() * inspires.length)]
    }, 2000)

    return { inspire }
  },
})
</script>
