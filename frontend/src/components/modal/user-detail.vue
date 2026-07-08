<template>
  <Modal :isVisible="show" @cancel="close()">
    <template #title>
      <h3 class="text-lg font-semibold capitilize">Confirm Detail</h3>
      <p class="text-xs">to place order</p>
    </template>
    <template #body>
      <div class="mx-auto">
        <form @submit.prevent="onConfirm" class="rounded-md">
          <div v-for="input in inputFields" class="mb-5">
            <label :for="input.id" class="block mb-2 text-sm font-normal text-gray-900 dark:text-white">{{ input.label }}</label>
            <input
              :id="input.id"
              :name="input.name"
              :type="input.type"
              :placeholder="input.placeholder"
              :required="input.required"
              v-model="input.value"
              @input="input.onInput?.(input, $event)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full p-2.5"
            />
             <p v-if="input.isError" class="text-red-500 text-xs mt-1">{{ input.errMessage }}</p>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button @click="onConfirm" :disabled="isFormInvalid" :class="isFormInvalid? 'opacity-30 cursor-not-allowed': ''" class="bg-gray-800 hover:bg-gray-900 focus:outline-none text-white text-sm font-medium py-3 px-4 rounded-md">Confirm</button>
      <button @click="onSkip" class="bg-gray-10 hover:bg-gray-100 text-black text-sm font-medium py-2 px-4 rounded-sm border border-gray-400 focus:outline-none">Skip</button>
      <!-- <button @click="close" class="bg-gray-10 hover:bg-gray-100 text-black text-sm font-medium py-2 px-4 rounded-sm border border-gray-400 focus:outline-none">Close</button> -->
    </template>
  </Modal>
</template>
<script lang="ts">
export interface InputField {
  id: string
  label: string
  name: string
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | string
  placeholder?: string
  required?: boolean
  value: string | number
  isError: boolean
  errMessage?: string
  onInput?: (field: InputField, event?: Event) => void
}

import { defineComponent, reactive, computed, ref } from 'vue'
import Modal from '@/components/global/modal.vue'
import type { User } from '@/types/fos'
import { store } from '@/stores'
export default defineComponent({
  name: 'UserDetail',
  components: {
    Modal,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const user = ref({} as User);
    const mobileRegex = /^[0-9]{10}$/;

    const validateInput = (field:any) => {
      field.isError = false;
      field.errMessage = '';
      if (field.name === 'customer_name') {
        if (!field.value || field.value.length < 3) {
          field.isError = true;
          field.errMessage = 'Please enter a valid name (min 3 characters)';
        }else{
          user.value.name = field.value.trim();
        }
      }
      if (field.name === 'mobile') {
        if (!field.value || !mobileRegex.test(field.value)) {
          field.isError = true;
          field.errMessage = 'Please enter a valid 10-digit mobile number';
        }else { user.value.mobile = field.value }
      }
    }

    const inputFields = reactive([
      { id: 'customer_name', label: 'Customer name', name: 'customer_name', type: 'text', placeholder:' Customer Name', required: true, value:'', isError: false, errMessage:'', onInput: validateInput },
      { id: 'mobile', label: 'Mobile', name: 'mobile', type: 'number', placeholder:' Customer Mobile', required: true, value:'', isError: false, errMessage:'', onInput: validateInput }
    ] as InputField[])

    const isFormInvalid = computed(() => {
      return inputFields.some(field => field.isError)
    })

    const close = () => {
      emit('close', false)
    }

    const onConfirm = () => {
      if(!isFormInvalid.value){
        if(store.app?.setUser){
          store.app.setUser(user.value);
        }
        close()
      }
    }

    const onSkip = () => {
      close();
    }

    return {
      close,
      onConfirm,
      onSkip,
      inputFields,
      isFormInvalid
    }

  }
})
</script>
<style scoped></style>
