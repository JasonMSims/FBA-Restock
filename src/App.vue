<template>
  <div class="flex h-screen flex-col">
    <TopNavbar />
    <RouterView />
  </div>
</template>
<script setup>
import { TopNavbar } from '@/components'
</script>
