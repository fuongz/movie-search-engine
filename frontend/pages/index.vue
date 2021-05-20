<template>
  <div
    class="
      w-full
      max-w-5xl
      text-center
      flex
      min-h-screen
      mx-auto
      pt-8
      lg:pt-16
      px-4
      lg:px-0
      transition-all
    "
  >
    <div class="w-full">
      <div id="logo" class="flex justify-center">
        <nuxt-link to="/">
          <img
            src="https://gtswiki.gt-beginners.net/decal/png/68/09/93/7421940990726930968_1.png"
            alt=""
            class="w-54 transition dark:transition dark:border-gray-900"
          />
        </nuxt-link>
      </div>

      <h1 class="text-2xl font-bold text-gray-600 uppercase tracking-widest">
        Phim <span class="text-gray-400">Phake</span>
      </h1>
      <p class="mt-2 text-gray-400 font-extralight text-xl">
        The free "<span class="font-normal">forever</span>" movie search engine
      </p>

      <div class="mt-8 max-w-3xl mx-auto">
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
            <input
              id="search-input"
              v-model="form.q"
              type="text"
              placeholder="tên phim"
              class="
                border border-gray-200
                input-shadow
                caret-pink-400
                block
                w-full
                pl-12
                pr-16
                py-4
                text-gray-700
                rounded-md
                font-mono font-light
                text-center text-2xl
                hover:transition
                focus:outline-none
                focus:transition
                placeholder-gray-700 placeholder-opacity-50
                disabled:bg-gray-200
                disabled:cursor-not-allowed
                transition
                dark:(placeholder-gray-500
                text-white
                bg-gray-800
                border-transparent
                transition
                )
                dark:focus:ring-pink-900
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
                right-6
                top-1/2
                transform
                -translate-y-1/2
                flex
                items-center
              "
            >
              <div
                :class="{
                  'cursor-not-allowed pointer-events-none': busy.searching,
                }"
                @click.prevent.stop="search"
              >
                <icon-search
                  class="
                    w-8
                    h-8
                    fill-gray-500
                    absolute
                    right-0
                    top-1/2
                    transform
                    transition
                    cursor-pointer
                    hover:(fill-pink-500
                    stroke-2
                    transition)
                    -translate-y-1/2
                  "
                />
              </div>
            </div>
          </div>
        </elements-overlay>
      </div>

      <div v-show="selectedMovie" id="current-video" class="my-8">
        <p class="text-center font-bold text-sm uppercase text-gray-500 mb-4">
          ヽ(￣～￣)ノ Yolo!
        </p>
        <h1 class="text-xl tracking-tight mb-4 font-semibold text-pink-700">
          {{ selectedMovie ? selectedMovie.title : '' }}
        </h1>
        <common-player :data="selectedMovie" @on-play="show.playing = true" />
      </div>

      <div v-if="results" id="results" class="my-8">
        <p
          class="
            font-medium font-mono
            text-2xl text-gray-700
            dark:text-gray-300
            text-center
            mb-6
            mt-16
          "
        >
          Kết quả
          <span class="font-bold dark:text-white">
            ({{ results.length }})
          </span>
        </p>
        <div
          class="
            grid
            gap-4
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            items-stretch
          "
        >
          <div v-for="(movie, index) in results" :key="`result-${index}`">
            <lazy-common-movie :data="movie" @on-play="setSelectedMovie" />
          </div>
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
  watch,
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
      smartSearch: true,
    })
    const show = ref({
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
.caret-pink-400 {
  caret-color: theme('colors.pink.400');
}
</style>
