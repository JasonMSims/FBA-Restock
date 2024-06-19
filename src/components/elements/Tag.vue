<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <span
    :class="[{ 'rounded-full': rounded }, outline ? outlineClasses[type].background : solidClasses[type].background]"
    class="tag group/tag relative mx-1 inline-flex cursor-default items-center justify-center overflow-hidden border px-3 py-1 text-xs transition-all first:ml-0 last:mr-0"
  >
    <svg :class="['mr-1 h-2 w-2', outlineClasses[type].accent]" fill="currentColor" v-if="outline && type !== 'default'" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="3" />
    </svg>
    <span :class="outline ? outlineClasses[type].text : solidClasses[type].text" class="font-medium">{{ label }}</span>
    <slot name="content"></slot>
  </span>
</template>
<script setup>
defineProps({
  label: { type: [String, Number] },
  outline: { default: true, type: Boolean },
  rounded: { default: true, type: Boolean },
  type: { default: 'default', type: String },
})

const outlineClasses = {
  default: {
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15 dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-danger': {
    accent: 'text-rose-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15 dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-data': {
    accent: 'text-cyan-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15 dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-info': {
    accent: 'text-blue-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15  dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-primary': {
    accent: 'text-purple-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15  dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-success': {
    accent: 'text-lime-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15  dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-warning': {
    accent: 'text-amber-400',
    background: 'border-slate-200 bg-white/60 dark:bg-slate-800/15  dark:border-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
  },
}

const solidClasses = {
  default: {
    background: 'border-transparent bg-slate-400/20 hover:bg-slate-400/30 dark:bg-white/5',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'is-danger': {
    background: 'border-transparent bg-rose-400/15 hover:bg-rose-400/25 dark:bg-rose-400/10',
    text: 'text-rose-700 dark:text-rose-400',
  },
  'is-data': {
    background: 'border-transparent bg-cyan-400/20 hover:bg-cyan-400/20 dark:bg-cyan-400/10',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
  'is-info': {
    background: 'border-transparent bg-blue-500/15 hover:bg-blue-400/25',
    text: 'text-blue-700 dark:text-blue-400',
  },
  'is-primary': {
    background: 'border-transparent bg-purple-500/15 hover:bg-purple-500/25',
    text: 'text-purple-700 dark:text-purple-400',
  },
  'is-success': {
    background: 'border-transparent bg-lime-400/20 hover:bg-lime-400/20 dark:bg-lime-400/10',
    text: 'text-lime-700 dark:text-lime-300',
  },
  'is-warning': {
    background: 'border-transparent bg-amber-400/20 hover:bg-amber-400/30 dark:bg-amber-400/10',
    text: 'text-amber-700 dark:text-amber-400',
  },
}
</script>
