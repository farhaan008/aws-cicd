<!-- <template>
  <tippy :placement="placement">
    <slot></slot>
    <template #content>
      <div class="flex flex-col place-items-start p-2">
        <div v-if="showTitle" class="font-semibold pb-2">
          {{ title }}
        </div>
        <ul v-if="descType === 'list'" class="list-disc pl-4">
          <li v-for="(item, index) in desc" :key="index" :class="colorClass ? colorClass : ''" class="text-xs">
            {{ item.text }}
          </li>
        </ul>
        <p v-else :class="(colorClass ? colorClass : '', showTitle && 'pb-2')" class="text-xs">{{ desc }}</p>
        <button v-if="action" class="py-2">+&nbsp;Readmore&nbsp;(Coming soon...)</button>
      </div>
    </template>
  </tippy>
</template> -->

<!-- <script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToolTip',

  props: {
    title: {
      required: false,
      type: String,
      default: 'Tooltip',
    },
    desc: {
      required: true,
      type: [String, Array],
    },
    descType: {
      required: false,
      type: String,
      default: 'plain',
    },
    action: {
      required: false,
      type: Boolean,
      default: false,
    },
    button: {
      required: false,
      type: String,
      default: 'primary',
    },
    buttonText: {
      required: false,
      type: String,
      default: 'Tooltip',
    },
    link: {
      required: false,
      type: String,
      default: 'Tooltip',
    },
    linkType: {
      required: false,
      type: String,
      default: 'button',
    },
    colorClass: {
      required: true,
      type: String,
      default: '',
    },
    showTitle: {
      required: false,
      type: Boolean,
      default: true,
    },
    placement: {
      required: false,
      type: String,
      default: 'auto',
    },
  },

  setup() {
    return {}
  },
})
</script> -->
