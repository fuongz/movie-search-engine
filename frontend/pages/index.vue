<template>
  <div class="w-full max-w-5xl text-center mx-auto pt-16 xl:px-0 px-4">
    <div class="flex justify-center">
      <img
        src="https://i.pinimg.com/564x/71/1f/e6/711fe62a75e00ae9e60eada3da044130.jpg"
        alt=""
        class="w-40 shadow-xl border-2 border-gray-500 rounded"
      />
    </div>
    <p class="mt-4 text-gray-500 font-normal">
      The free "<b>forever</b>" movie search engine
    </p>

    <div class="mt-16 max-w-3xl mx-auto">
      <div
        v-if="errors"
        class="
          mb-4
          border border-pink-400
          bg-pink-100
          text-pink-700
          rounded
          font-medium
          px-4
          py-2
          relative
        "
      >
        <span class="uppercase tracking-tight font-bold mr-4 text-sm">
          📢 Alo alo:
        </span>
        {{ errors }} <b>(￣ ￣|||)</b>
      </div>

      <elements-overlay :busy="busy.searching">
        <div>
          <icon-search
            class="
              fill-gray-300
              absolute
              left-4
              top-1/2
              transform
              -translate-y-1/2
            "
          />
          <input
            v-model="form.q"
            type="text"
            placeholder="Nhập tên phim và bấm Enter để tìm kiếm"
            class="
              block
              w-full
              pl-12
              pr-4
              py-2
              border border-gray-300
              text-gray-600
              rounded
              transtion
              focus:ring-pink-700 focus:ring-2
              hover:transition
              focus:border-transparent
              focus:outline-none
              focus:transition
              placeholder-gray-600 placeholder-opacity-50
              disabled:bg-gray-200
              disabled:cursor-wait
            "
            :class="{
              'ring-pink-600 ring-2 border-transparent':
                errors && (form.q === null || form.q === ''),
            }"
            :disabled="busy.searching"
            @keyup.enter="search"
          />
          <button
            class="
              border
              bg-gray-50
              text-gray-400
              py-0.5
              px-1.5
              rounded
              absolute
              right-2
              top-1/2
              transform
              -translate-y-1/2
              z-1
              transition
              hover:transition
              hover:bg-gray-100
              hover:text-gray-600
              focus:outline-none
              disabled:text-gray-400
              disabled:bg-gray-50
              disabled:select-none
              disabled:cursor-wait
            "
            :disabled="busy.searching"
            @click.prevent.stop="search"
          >
            enter
          </button>
        </div>
      </elements-overlay>
    </div>

    <div
      v-show="selectedMovie"
      class="my-8 bg-pink-50 border-pink-600 border p-4"
    >
      <p class="text-center font-bold text-sm uppercase text-gray-500 mb-4">
        ヽ(￣～￣)ノ Yolo!
      </p>
      <h1
        class="text-xl tracking-tight mb-4 font-weight-semibold text-pink-700"
      >
        {{ selectedMovie ? selectedMovie.title : '' }}
      </h1>
      <common-player :data="selectedMovie" />
    </div>

    <div v-show="results" class="my-8">
      <p class="text-left text-gray-700">
        Có tất cả <b>{{ results && results.length }}</b> kết quả:
      </p>
      <div
        v-if="results && results.length > 0"
        class="
          grid
          gap-4
          grid-cols-1
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          items-stretch
          mt-4
        "
      >
        <div v-for="(movie, index) in results" :key="`result-${index}`">
          <lazy-common-movie :data="movie" @on-play="setSelectedMovie" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  useContext,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import IconSearch from '~/assets/svg/icon-search.svg?inline'

export default defineComponent({
  components: { IconSearch },
  setup() {
    const busy = reactive({
      searching: false,
    })
    const form = ref({
      q: null,
    })
    const errors = ref(null)
    const results = ref(null)
    const selectedMovie = ref(null)
    const router = useRouter()
    const route = useRoute()
    const { $axios } = useContext()

    onMounted(async () => {
      if (route.value.query.q) {
        form.value.q = route.value.query.q
        await search()
      }
    })

    /**
     * Search func
     */
    const search = async () => {
      try {
        errors.value = null
        if (!form.value.q || form.value.q === '') {
          throw new Error('Viết đại cái gì đó cũng được mà.')
        }
        router.push({
          query: {
            q: form.value.q,
          },
        })
        if (process.browser) {
          let searchHistory = localStorage.getItem('searchHistory')
          let searchValues = []

          if (searchHistory) {
            searchHistory = JSON.parse(searchHistory)
            if (searchHistory.value) searchValues = [...searchHistory.value]
          }

          localStorage.setItem(
            'searchHistory',
            JSON.stringify({
              value: [...new Set([...searchValues, form.value.q])],
            })
          )
        }
        busy.searching = true
        const response = await $axios.get(`/api/movies?q=${form.value.q}`)
        const responseBody = response.data
        results.value = responseBody
        busy.searching = false
      } catch (err) {
        busy.searching = false
        errors.value = err.message
      }
    }

    const setSelectedMovie = (movie) => {
      if (movie) selectedMovie.value = movie
    }

    return {
      search,
      busy,
      form,
      errors,
      results,
      setSelectedMovie,
      selectedMovie,
    }
  },
})
</script>
