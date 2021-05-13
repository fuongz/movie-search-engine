<template>
  <div class="w-full max-w-5xl text-center mx-auto pt-16 xl:px-0 px-4">
    <div id="logo" class="flex justify-center">
      <nuxt-link to="/">
        <img
          src="https://i.pinimg.com/564x/71/1f/e6/711fe62a75e00ae9e60eada3da044130.jpg"
          alt=""
          class="
            w-40
            shadow-xl
            border-2 border-gray-500
            rounded
            transition
            dark:transition
            dark:border-gray-900
          "
        />
      </nuxt-link>
    </div>
    <p class="mt-4 text-gray-500 font-normal">
      The free "<b>forever</b>" movie search engine
    </p>

    <div class="mt-4 flex items-center">
      <a
        href="https://github.com/senpp/movie-search-engine"
        target="_blank"
        rel="noopener noreferrer"
        title="senpp/movie-search-engine"
        class="block mx-auto"
      >
        <icon-github
          class="
            w-6
            h-6
            text-gray-300
            hover:text-gray-500
            dark:hover:text-gray-100
            fill-current
          "
        />
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
          transition
          dark:transition
          dark:bg-red-900
          dark:border-transparent
          dark:text-white
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
              disabled:cursor-not-allowed
              transition
              dark:transition
              dark:bg-gray-800
              dark:border-gray-800
              dark:text-white
              dark:focus:ring-pink-900
              dark:placeholder-gray-500
            "
            :class="{
              'ring-red-600 ring-2 border-transparent':
                errors && (form.q === null || form.q === ''),
            }"
            :disabled="busy.searching"
            @keyup.enter="search"
          />

          <div
            class="
              absolute
              right-3
              top-1/2
              transform
              -translate-y-1/2
              flex
              items-center
            "
          >
            <div class="flex items-center">
              <div class="overflow-hidden flex items-center">
                <input
                  id="smart-search"
                  v-model="form.smartSearch"
                  type="checkbox"
                  class="input-checkbox"
                />
                <label for="smart-search" class="input-decorator" />
              </div>
              <label for="smart-search" class="input-label"> Phim lẻ </label>
            </div>

            <button
              class="
                border
                bg-gray-50
                text-gray-400
                py-1
                px-2
                ml-2
                rounded
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
                disabled:cursor-not-allowed
                transition
                dark:transition
                dark:bg-gray-700
                dark:border-gray-700
                dark:hover:bg-gray-600
                dark:hover:text-gray-300
                dark:disabled:bg-gray-800
              "
              :disabled="busy.searching"
              @click.prevent.stop="search"
            >
              enter
            </button>
          </div>
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
      <common-player :data="selectedMovie" @on-play="show.playing = true" />
    </div>

    <div v-if="results" id="results" class="my-8">
      <p class="text-left text-gray-700 dark:text-gray-300">
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

    <div
      v-if="$device.isDesktop"
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
        '-top-44 hover:-top-40': !show.bulb,
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
  </div>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  useContext,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import IconSearch from '~/assets/svg/icon-search.svg?inline'
import IconGithub from '~/assets/svg/icon-github.svg?inline'
import IconBulb from '~/assets/svg/icon-bulb.svg?inline'
import IconSun from '~/assets/svg/icon-sun.svg?inline'
import IconMoon from '~/assets/svg/icon-moon.svg?inline'

export default defineComponent({
  components: { IconSearch, IconGithub, IconBulb, IconSun, IconMoon },

  setup() {
    const busy = reactive({
      searching: false,
    })
    const form = ref({
      q: null,
      smartSearch: false,
    })
    const show = ref({
      bulb: false,
      playing: false,
    })
    const errors = ref(null)
    const results = ref(null)
    const selectedMovie = ref(null)
    const router = useRouter()
    const route = useRoute()
    const { $axios } = useContext()

    /**
     * Set input value if route param q exists
     */
    onMounted(async () => {
      if (route.value.query.smartSearch) {
        form.value.smartSearch = route.value.query.smartSearch
      }

      if (route.value.query.q) {
        form.value.q = route.value.query.q
        await search()
      }
    })

    watch(
      () => form.value.smartSearch,
      (val) => {
        setQuery('smartSearch', val === true || val === 'true' ? 1 : null)
      }
    )

    onBeforeMount(() => {
      document.addEventListener('scroll', showBulb)
    })

    const showBulb = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const $element = document.querySelector('#logo')
      const elementPosition =
        $element.getBoundingClientRect().top + scrollY + $element.clientHeight

      if (scrollY > elementPosition - 50) {
        show.value.bulb = true
      } else {
        show.value.bulb = false
      }
    }

    const setQuery = (key, val) => {
      const currentQuery = route.value.query
      router.push({
        query: {
          ...currentQuery,
          [key]: val,
        },
      })
    }

    /**
     * Search func
     */
    const search = async () => {
      try {
        errors.value = null
        if (!form.value.q || form.value.q === '') {
          setQuery('q', null)
          throw new Error('Viết đại cái gì đó cũng được mà.')
        }

        setQuery('q', form.value.q)

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
        const response = await $axios.get('/', {
          params: {
            q: form.value.q,
            smartSearch: form.value.smartSearch,
          },
        })
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

    /**
     * Set selectec movie func
     */
    const setSelectedMovie = (movie) => {
      if (movie) selectedMovie.value = movie
    }

    return {
      search,
      show,
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

<style lang="postcss" scoped>
.light-bulb::before {
  @apply absolute bg-gray-200 top-0 left-1/2;
  content: '';
  width: 1px;
  height: 160px;
}
</style>
