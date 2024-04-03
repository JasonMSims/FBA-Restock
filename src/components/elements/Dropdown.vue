<template>
  <Combobox as="div" v-model="currentOption" @update:model-value="$emit('update:currentOption', $event)" :disabled="disabled">
    <div class="relative mt-1">
      <ComboboxInput
        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        @change="query = $event.target.value"
        :display-value="(option) => option"
        :placeholder="placeholder"
      />
      <ComboboxButton :class="['absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none']">
        <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true"></ChevronUpDownIcon>
      </ComboboxButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <ComboboxOptions
          v-if="filteredOptions.length > 0"
          :class="[
            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
          ]"
        >
          <ComboboxOption v-slot="{ active, selected }" v-for="(option, optionIdx) in filteredOptions" :key="optionIdx" :value="option" as="template">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ option.name }}
              </span>
              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  options: Array,
  currentOption: String,
  placeholder: String,
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  shadow: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const query = ref('')
const currentOption = ref(props.currentOption)
// const options = ref(props.options)

const filteredOptions = computed(() =>
  query.value === '' ? props.options : props.options.filter((option) => option?.name.toLowerCase().includes(query.value.toLowerCase()))
)
</script>
