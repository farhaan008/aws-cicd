<!-- <template>
  <div v-if="totalItems" :id="totalPages" class="bg-white pt-2 my-2 flex items-center justify-between border rounded-md border-gray-200">
    <div class="flex-1 flex items-center justify-between w-full">
      <div class="grid grid-cols-1">
        <div class="relative inline-flex items-center px-4 py-2 text-sm select-none cursor-pointer mt-1">
          <select v-model="limit" @change="$emit('onLimitChange', limit)" class="relative inline-flex items-center cursor-pointer rounded text-sm p-2 border border-gray-300">
            <option value="5">5 /Page</option>
            <option value="10">10 /Page</option>
            <option value="15">15 /Page</option>
            <option value="30">30 /Page</option>
            <option value="50">50 /Page</option>
            <option value="100">100 /Page</option>
            <option value="150">150 /Page</option>
            <option value="200">200 /Page</option>
          </select>
        </div>
      </div>
    </div>
    <div class="w-1/3 px-4 py-2">
      <p :class="widthHeight ? 'text-xs' : 'text-sm'">
        Showing {{ ' ' }}
        <span>{{ offset + 1 }}</span>
        {{ ' ' }} to {{ '' }}
        <span>{{ Number(offset) + Number(limit) > Number(totalItems) ? Number(totalItems) : Number(offset) + Number(limit) }}</span>
        {{ ' ' }} of {{ ' ' }}
        <span>{{ totalItems }}</span>
        {{ ' ' }} results
      </p>
    </div>
    <div class="w-1/3 mr-4" :class="widthHeight ? 'end' : 'end'">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px -ml-6" :class="widthHeight ? 'h-6' : ''" aria-label="Pagination">
        <a
          :style="widthHeight ? 'width: 38px' : ''"
          @click="onClickPrev"
          class="relative inline-flex items-center p-2 rounded-l-md border border-gray-300 bg-white text-sm hover:bg-gray-50 select-none cursor-pointer"
        >
          <img src="@/assets/icon/arrow-right.svg" class="transform rotate-180 h-5 w-5" />
        </a>
        <div
          v-for="item in pages"
          :key="item"
          class="relative inline-flex items-center px-4 py-2 border text-sm select-none cursor-pointer"
          aria-current="page"
          :class="[activePage === item ? 'z-10 bg-blue-500 border-gray-300 text-white' : 'bg-white border-gray-300 text-warm-grey hover:bg-gray-50']"
          @click="((activePage = item), onClickPage())"
        >
          {{ item }}
        </div>
        <div @click="onClickNext" class="relative inline-flex items-center p-2 rounded-r-md border border-gray-300 bg-white text-sm hover:bg-gray-50 select-none cursor-pointer">
          <img class="h-5 w-5" src="@/assets/icon/arrow-right.svg" alt=">" />
        </div>
      </nav>
    </div>
  </div>
</template> -->

<!-- <script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VPagination',
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    recordPerPage: {
      type: Boolean,
      required: false,
      default: false,
    },
    itemLimit: {
      type: Number,
      required: false,
      default: 15,
    },
    widthHeight: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props, { emit }) {
    const activePage = ref(1)
    const limit = ref(props.itemLimit)

    const totalPages = computed(() => {
      resetDefault()
      return Math.ceil(props.totalItems / limit.value)
    })

    const pages = computed(() => {
      let numShown = 5
      numShown = Math.min(numShown, totalPages.value)
      let first = activePage.value - Math.floor(numShown / 2)
      first = Math.max(first, 1)
      first = Math.min(first, totalPages.value - numShown + 1)
      return [...Array(numShown)].map((_, idx) => idx + first)
    })

    const offset = computed(() => {
      return (activePage.value - 1) * limit.value
    })

    const onClickNext = () => {
      if (activePage.value < totalPages.value) {
        activePage.value = activePage.value + 1
        onClickPage()
      }
    }
    const onClickPrev = () => {
      if (activePage.value > 1) {
        activePage.value = activePage.value - 1
        onClickPage()
      }
    }

    const resetDefault = () => {
      activePage.value = 1
    }
    const onClickPage = () => {
      emit('onClickPage', offset.value)
    }

    return {
      activePage,
      totalPages,
      limit,
      offset,
      pages,
      onClickNext,
      onClickPrev,
      onClickPage,
    }
  },
})
</script> -->
<!-- <style scoped>
.end {
  text-align: end;
}
</style> -->
