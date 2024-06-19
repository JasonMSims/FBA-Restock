<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Switch
    :class="colors[color]"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ring-offset-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-950"
    v-model="enabled"
    v-slot="{ checked }"
  >
    <span class="sr-only">Dark mode</span>
    <span
      :class="[checked ? 'translate-x-5' : 'translate-x-0']"
      aria-hidden="true"
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 !transition duration-200 ease-in-out dark:bg-slate-800"
    >
      <span aria-hidden="true" class="transition-opacity' absolute inset-0 flex h-full w-full items-center justify-center">
        <slot name="icon"> </slot>
      </span>
    </span>
  </Switch>
</template>
<script setup>
import { Switch } from '@headlessui/vue'
import { computed } from 'vue'

const enabled = defineModel({ default: false, type: Boolean })

defineProps({
  color: {
    default: 'slate',
    type: String,
  },
})

const colors = computed(() => ({
  green: [enabled.value ? 'bg-green-400 dark:bg-green-400/90' : 'bg-slate-200 dark:bg-slate-700', 'focus:ring-green-400/90'],
  indigo: [enabled.value ? 'bg-indigo-600 dark:bg-indigo-600/50' : 'bg-slate-200 dark:bg-slate-700', 'focus:ring-indigo-600/90'],
  rose: [enabled.value ? 'bg-rose-700 dark:bg-rose-500/50' : 'bg-slate-200 dark:bg-slate-700', 'focus:ring-rose-500/50'],
  slate: [
    enabled.value ? 'bg-slate-700 dark:bg-slate-500/50' : 'bg-slate-200 dark:bg-slate-700',
    'focus:ring-indigo-600/90 dark:focus:ring-indigo-400/90',
  ],
}))
</script>
