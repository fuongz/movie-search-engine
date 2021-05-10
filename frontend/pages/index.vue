<template>
  <div class="w-full max-w-5xl text-center mx-auto pt-16 xl:px-0 px-4">
    <div
      class="
        fixed
        top-0
        z-50
        text-left
        md:text-center
        bg-white
        w-full
        border-b border-pink-200
        left-0
        px-4
        py-2
        text-xs
        md:text-sm
        text-pink-600
        bg-pink-50
        flex
        justify-center
        items-center
      "
    >
      <span>
        Dự án này sinh ra cho mục đích nghiên cứu, nghiêm cấm thương mại hóa
        dưới mọi hình thức.
      </span>
    </div>

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

    <div class="mt-4">
      <a
        href="https://github.com/senpp/movie-search-engine"
        target="_blank"
        rel="noopener noreferrer"
        title="senpp/movie-search-engine"
      >
        <icon-github class="w-6 h-6 text-gray-300 fill-current" />
      </a>
    </div>

    <div class="mt-8 xl:mt-16 max-w-3xl mx-auto">
      <div
        v-if="errors"
        class="
          mb-4
          border border-red-400
          bg-red-50
          text-red-600
          rounded
          pl-1.5
          pr-4
          py-2
          text-left
          relative
        "
      >
        <span
          class="
            tracking-tight
            font-bold
            mr-4
            text-sm
            bg-red-600
            text-white
            px-1.5
            py-1.5
            rounded
          "
        >
          🐛 Error!
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
            placeholder="Nhấn Enter để tìm kiếm"
            class="
              block
              w-full
              pl-12
              pr-16
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
              'ring-red-600 ring-2 border-transparent':
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
              py-1
              px-2
              rounded
              absolute
              right-2
              top-1/2
              transform
              -translate-y-1/2
              z-1
              text-xs
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

      <common-inspire v-if="!results" />
    </div>

    <div v-show="selectedMovie" id="current-video" class="my-8">
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

    <div v-if="results" id="results" class="my-8">
      <p class="text-left text-gray-700">
        Có tất cả <b>{{ results.length }}</b> kết quả:
      </p>
      <div
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
  computed,
  useContext,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import IconSearch from '~/assets/svg/icon-search.svg?inline'
import IconGithub from '~/assets/svg/icon-github.svg?inline'

export default defineComponent({
  components: { IconSearch, IconGithub },
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
          router.push({
            query: {
              q: null,
            },
          })
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
        const response = await $axios.get(`?q=${form.value.q}`)
        const responseBody = response.data
        if (Array.isArray(responseBody) && responseBody.length === 0) {
          throw new Error(
            'Kiếm thử bộ khác đi người anh em, bộ này kiếm hoài không ra...'
          )
        }
        results.value = responseBody
        busy.searching = false

        const $ele = document.querySelector('#results')
        if ($ele) {
          const y = $ele.getBoundingClientRect().top + window.pageYOffset - 60
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      } catch (err) {
        busy.searching = false
        results.value = null
        errors.value = err.message
      }
    }

    const setSelectedMovie = (movie) => {
      if (movie) selectedMovie.value = movie
    }

    const hideNotice = () => {
      if (process.browser) {
        localStorage.setItem('acceptedImportantNotice', true)
      }
    }

    const checkImportantNotice = computed(() => {
      if (process.browser) {
        const acceptedImportantNotice = localStorage.getItem(
          'acceptedImportantNotice'
        )
        return acceptedImportantNotice === 'true'
      }
      return false
    })

    return {
      search,
      busy,
      form,
      errors,
      results,
      setSelectedMovie,
      selectedMovie,
      hideNotice,
      checkImportantNotice,
    }
  },
})
</script>
