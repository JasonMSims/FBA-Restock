<template>
  <div class="flex h-screen flex-col">
    <div class="flex justify-end border-b border-slate-900/5 bg-slate-100/25 px-4 py-4 dark:border-white/5 dark:bg-slate-900/25 sm:px-6 lg:px-8">
      <Toggle v-model="isDark">
        <template #icon>
          <component :is="isDark ? Moon : Sun" class="text-slate-700 dark:text-white" size="14" />
        </template>
      </Toggle>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import { useDark } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'

import { Toggle } from './components'

const isDark = useDark()
</script>
