<!-- <template>
  <div class="relative v-select" :id="id" :name="name">
    <template v-if="defaultTrigger">
      <p v-if="label" class="flex ml-2 px-2 py-0.5 absolute rounded text-xs -mt-3 bg-gradient-to-t from-white">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
        <tooltip v-if="showInfo" :title="label" :desc="infoText">
          <img src="@/assets/icons/info.svg" class="w-4 h-4 cursor-pointer" alt="Info Icon" />
        </tooltip>
      </p>
      <div
        class="flex items-center appearance-none border border-gray-200 w-full p-2 rounded-lg focus:outline-none"
        :class="[disabled ? 'cursor-default bg-gray-200' : 'cursor-pointer bg-white', { 'ring-1 ring-red-500': required && (isDirty || isError) }]"
        role="select"
        @click="showList = !showList"
      >
        <div v-if="selectValue && selectValue.length === 0">{{ placeholder }}</div>
        <div v-if="selectValue && selectValue.length > 0 && !taggable" class="select-value whitespace-nowrap overflow-hidden overflow-ellipsis">{{ selectValue[0][optsKey] }}</div>
        <div v-if="selectValue.length > 1 && multiple && !taggable" class="font-semibold pl-1 pr-2">(+{{ selectValue.length - 1 }})</div>
        <div v-if="taggable" class="flex flex-wrap">
          <div v-for="(item, idx) in selectValue" :key="idx" class="flex text-white bg-aqua rounded-md p-1.5 w-max m-1">
            <span class="text-xs whitespace-nowrap">{{ item[optsKey] }}</span>
            <button type="button" class="ml-1 px-1.5 text-xs text-white shadow-lg" @click.stop="removeItem(idx)">
              <img src="@/assets/icons/close.svg" class="w-3 h-3" alt="Remove Tag" />
            </button>
          </div>
        </div>
        <img src="@/assets/icons/arrow-down.svg" class="w-4 h-4 ml-
         zauto" alt="Dropdown Icon" />
      </div>
    </template>
    <template v-else>
      <div @click="showList = !showList">
        <slot></slot>
      </div>
    </template>

    <div v-if="showList && !disabled" :class="width && width !== '' ? width : 'w-full'" class="absolute bg-white shadow-lg rounded-b-md z-10">
      <div v-if="searchable" class="flex my-1 mx-2 p-2 items-center border-2 bg-gray-100 border-aqua rounded-md">
        <img src="@/assets/icons/search.svg" class="w-4 h-4 mr-2 select-none bg-gray-100" alt="Search Icon" />
        <input name="ops-search" type="text" autocomplete="off" autofocus v-model="searchQuery" @input="onSearch()" class="w-full bg-gray-100 bg-transparent appearance-none outline-none" />
        <button @click="clearSearch" class="ml-2 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div v-if="groupable == false" :id="`ddl-${id}`" @scroll="scroll($event, `ddl-${id}`, `${id}`)" class="max-h-52 overflow-y-scroll">
        <div
          v-for="(item, idx) in filteredData"
          :key="`${idx}-${id}`"
          :title="item[optsDescKey || optsKey]"
          :class="[isSelectDisabled(item) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer opacity-100']"
          class="flex relative py-2 px-4 overflow-hidden break-all hover:bg-gray-100"
        >
          <input
            v-if="multiple"
            class="mr-2 mt-1"
            type="checkbox"
            :id="`${idx}-${id}`"
            :key="`${idx}-${id}`"
            :name="item[optsKey]"
            :value="item"
            :v-model="selectValue"
            @change="triggerSelectValues"
            :disabled="isSelectDisabled(item)"
          />
          <label v-if="multiple" :for="`${idx}-${id}`" class="absolute inset-0 cursor-pointer select-none"></label>
          <label @click="onSelectItem(item)" v-else :for="`${idx}-${id}`" class="absolute inset-0 cursor-pointer select-none"></label>
          <span :key="`${idx}-${id}`">{{ item[optsKey] }}</span>
        </div>
      </div>

      <div v-else @scroll="scroll($event, `ddl-${id}`, `${id}`)" :id="`ddl-${id}`" class="max-h-52 overflow-y-scroll">
        <div
          v-for="(itemGroup, indexG) in GroupByArray"
          :key="`group-${indexG}-${id}`"
          :id="`group-${indexG}-${id}`"
          class="flex relative py-2 px-4 overflow-hidden break-all hover:bg-gray-100 inline"
        >
          <div class="flex relative py-2 px-4 overflow-hidden break-all hover:bg-gray-100">{{ itemGroup }}</div>
          <div
            class="flex relative py-2 px-8 overflow-hidden break-all hover:bg-gray-100"
            v-for="(item, idx1) in filteredGroupData(itemGroup)"
            :key="`${itemGroup}-${idx1}-${id}`"
            :title="item[optsDescKey || optsKey]"
            :class="[isSelectDisabled(item) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer opacity-100']"
          >
            <input
              v-if="multiple"
              class="mr-2 mt-1"
              type="checkbox"
              :id="`${itemGroup}-${idx1}-${id}`"
              :key="`${itemGroup}-${idx1}-${id}`"
              :name="item[optsKey]"
              :value="item"
              v-model="selectValue"
              @change="triggerSelectValues"
              :disabled="isSelectDisabled(item)"
            />
            <label v-if="multiple" :for="`${itemGroup}-${idx1}-${id}`" class="absolute inset-0 cursor-pointer select-none"></label>
            <label v-else @click="onSelectItem(item)" :for="`${itemGroup}-${idx1}-${id}`" class="absolute inset-0 cursor-pointer select-none"></label>
            <span data="{{ `${itemGroup}-${idx1}-${id}` }}" :key="`${itemGroup}-${idx1}-${id}`">{{ item[optsKey] }}</span>
          </div>
        </div>
      </div>
      <div v-if="showClearButton" class="flex justify-end items-center px-2">
        <div class="flex items-center cursor-pointer hover:bg-gray-100 p-2">
          <img src="@/assets/icons/close.svg" class="w-4 h-4" alt="Clear Selection" @click="onClear" />
          <span>Clear</span>
        </div>
      </div>
    </div>
  </div>
</template> -->

<!-- <script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import type { IVSelect } from '@/types/elements/select'
// import Tooltip from '@/components/elements/tooltip.vue';
// import { useDebounceFn } from '@vueuse/core' ;

export default defineComponent({
  name: 'VSelect',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    label: {
      type: String,
      required: true,
      default: 'Select',
    },
    value: {
      required: false,
      type: [Array, Object, String, Number, Boolean],
    },
    options: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Please select',
    },
    multiple: {
      required: false,
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      required: false,
      default: false,
    },
    idKey: {
      type: String,
      required: false,
      default: 'id',
    },
    optsKey: {
      type: String,
      required: false,
      default: 'name',
    },
    optsDescKey: {
      type: String,
      required: false,
      default: '',
    },
    clearSearchOnSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    showInfo: {
      type: Boolean,
      required: false,
      default: false,
    },
    infoText: {
      type: String,
      required: false,
      default: 'info',
    },
    showClearButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    taggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    apiSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    isError: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxLimit: {
      type: Number,
      required: false,
      default: -1, // -1 means no limit
    },
    defaultTrigger: {
      type: Boolean,
      required: false,
      default: true,
    },
    width: {
      type: String,
      required: false,
      default: '', // e.g., 'w-64' or 'w-full'
    },
    scrollable: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupable: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupBy: {
      type: String,
      required: false,
      default: '', // The key to group by
    },
    // optsData: {
    //   type: Array as () => Array<IVSelect>,
    //   required: true,
    // },
  },
  setup(props, { emit }) {
    const showList = ref(false)
    const searchQuery = ref('')
    const selectValue = ref<Array<IVSelect>>([])
    const isDirty = ref(false)

    const GroupByArray = computed(() => {
      if (!props.groupBy) return []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groups = new Set(filteredData.value.map((item: any) => item[props.groupBy]))
      return Array.from(groups)
    })

    const scroll = (event: Event, id: string, key: string) => {
      if (!props.scrollable) return
      const target = event.target as HTMLElement
      const box = document.getElementById(id)
      const allChildren = box?.getElementsByTagName('div').length ?? 0
      const isScrolledToBottom = Math.ceil(target.scrollTop) >= target.scrollHeight - target.offsetHeight

      if (isScrolledToBottom) {
        emit('onVSelectScroll', key, allChildren, searchQuery.value)
      }
    }

    const filteredData = computed(() => {
      const query = searchQuery.value.trim().toLowerCase()
      if (!query || props.apiSearch) return props.options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return props.options.filter((item: any) => {
        return Object.values(item).some((value) => String(value).toLowerCase().includes(query))
      })
    })

    const isSelectDisabled = (item: IVSelect) => {
      const index = selectValue.value.findIndex((selected: IVSelect) => selected[props.optsKey] === item[props.optsKey])
      if (props.maxLimit === -1 && index === -1)
        return false // No limit, allow selection
      else if (selectValue.value.length >= props.maxLimit && props.maxLimit !== -1 && index === -1)
        return true // Limit reached, disable further selection
      else return false // Allow selection
    }

    const onSearch = () => {
      const query = searchQuery.value.trim().toLowerCase()
      if (props.apiSearch) {
        emit('onSearch', query, props.id)
      }
    }

    const onSelectItem = (item: IVSelect) => {
      searchQuery.value = ''
      selectValue.value = []
      selectValue.value.push({ ...item })
      triggerValues()
    }

    const onClear = () => {
      selectValue.value = []
      searchQuery.value = ''
      triggerValues()
      emit('onClearClick', props.id)
    }

    const removeItem = (index: number) => {
      if (selectValue.value.length > 0) {
        selectValue.value.splice(index, 1)
      }
      triggerValues()
    }

    const outsideClick = (event: Event) => {
      const ignoreClickOnMeEl = document.getElementById(props.id) as HTMLDivElement
      const isClickInsideElement = ignoreClickOnMeEl?.contains(event.target as Node)
      if (!isClickInsideElement) {
        showList.value = false
      }
    }

    const triggerValues = () => {
      if (props.required && selectValue.value.length === 0) {
        isDirty.value = true
      } else {
        isDirty.value = false
      }
      if (!props.multiple && selectValue.value.length > 0) {
        showList.value = false // Close the dropdown if single select
        emit('onSelect', selectValue.value[0])
        emit('onBlur')
        return
      }
      nextTick(() => {
        emit('onSelect', selectValue.value)
        emit('onBlur')
      })
    }

    const triggerSelectValues = () => {
      triggerValues()
    }

    const filteredGroupData = (name: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return filteredData.value.filter((item: any) => item[props.groupBy].toString() === name)
    }

    watch(showList, (show) => {
      if (show) {
        document.addEventListener('click', outsideClick, false)
      } else {
        document.removeEventListener('click', outsideClick, false)
        if (props.required) {
          isDirty.value = selectValue.value.length === 0 ? true : false
        }
      }
    })

    watch(
      () => props.value,
      () => {
        if (props.multiple) {
          const newValues = props.value as IVSelect[]
          selectValue.value = []
          newValues.forEach((item: IVSelect) => {
            selectValue.value.push({ ...item })
          })
        } else {
          const temp = props.value as IVSelect
          nextTick(() => {
            selectValue.value = temp && Object.keys(temp).length > 0 ? [temp] : []
          })
        }
        nextTick(() => {
          if (selectValue.value && selectValue.value.length > 0 && props.required) {
            isDirty.value = false
          }
        })
      },
      { immediate: true, deep: true },
    )

    watch(
      () => props.options,
      () => {
        if (props.maxLimit === -1 && props.options && props.options.length > 0 && !props.apiSearch) {
          selectValue.value.forEach((val: IVSelect) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props.options.forEach((opts: any) => {
              if (val[props.optsKey] !== opts[props.optsKey]) {
                selectValue.value = []
                if (triggerValues) {
                  triggerValues()
                }
              }
            })
          })
        }
      },
      { immediate: true },
    )

    return {
      showList,
      searchQuery,
      selectValue,
      filteredData,
      onSelectItem,
      onClear,
      isDirty,
      removeItem,
      onSearch,
      triggerSelectValues,
      isSelectDisabled,
      scroll,
      GroupByArray,
      filteredGroupData,
    }
  },
})
</script>
<style scoped>
.v-select .select-value {
  width: calc(100% - 15px);
}
</style> -->
