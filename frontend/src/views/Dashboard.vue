<template>
  <div>
    <h1>This is component page</h1>

    <v-select
      :id="'vselect1'"
      :name="'vselect1'"
      :label="'Select'"
      :placeholder="'Please Select'"
      :optsKey="'name'"
      :searchable="true"
      :options="options"
      :value="value"
      @onSelect="((value = $event), onValChange($event))"
    ></v-select>

    <v-pagination :totalItems="count || 0" @onClickPage="onClickPage" :itemLimit="limit"></v-pagination>
    <button @click="getToastMsg()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Show Toast</button>
    <button @click="showModal()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Show Modal</button>

    <sample-modal :show="show" @close="show = false"></sample-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { store } from '@/stores'
import VSelect from '@/components/elements/v-select.vue'
import { showToast } from '@/utils/common/common-functions'
import SampleModal from '@/components/modal/user-detail.vue'
import VPagination from '@/components/elements/v-pagination.vue'

export default defineComponent({
  components: { SampleModal, VSelect, VPagination },
  name: 'DashboardView',
  setup() {
    const Obj = reactive({
      show: false,
      value: undefined,
      options: [
        { id: 1, name: 'India' },
        { id: 2, name: 'China' },
        { id: 3, name: 'Italy' },
      ],
      limit: 15,
      offset: 0,
      count: 50,
    })

    const getToastMsg = () => {
      showToast('Record Added Successfully', true)
    }

    const showModal = () => {
      Obj.show = !Obj.show
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onValChange(event: any) {
      console.log(event)
    }

    const onClickPage = (offset: number) => {
      Obj.offset = offset
    }

    store.app.showToast({
      message: 'Welcome to the Dashboard!',
      type: 'success',
      duration: 3000,
    })

    return {
      ...toRefs(Obj),
      getToastMsg,
      showModal,
      onValChange,
      onClickPage,
    }
  },
})
</script>

<style></style>
