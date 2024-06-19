<template>
  <div
    class="flex items-center justify-between gap-2 border-b border-slate-900/5 bg-slate-100/25 px-4 py-4 dark:border-white/5 dark:bg-slate-900/25 sm:px-6 lg:px-8"
  >
    <span></span>
    <!-- <Search align="center" class="max-w-3xl grow justify-self-center" rounded="full" /> -->

    <Toggle v-model="isDark">
      <template #icon>
        <component :is="isDark ? MoonIcon : SunIcon" class="text-slate-700 dark:text-white" size="14" />
      </template>
    </Toggle>
  </div>
</template>
<script setup>
import { Toggle } from '@/components'
import { useDark } from '@vueuse/core'
import { MoonIcon, SunIcon } from 'lucide-vue-next'

const isDark = useDark()
</script>
