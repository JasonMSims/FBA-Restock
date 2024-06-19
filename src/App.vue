<template>
  <div class="flex h-screen flex-col">
    <TopNavbar v-if="hasDarkMode" />
    <RouterView />
  </div>
</template>
<script setup>
import { TopNavbar } from '@/components'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hasDarkMode = ref(route.meta.hasDarkMode)

watch(route, (newRoute) => {
  hasDarkMode.value = newRoute.meta.hasDarkMode
})
</script>
