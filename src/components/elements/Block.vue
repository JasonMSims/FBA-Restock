<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative max-w-screen-md">
    <h2 class="mb-4 font-bold tracking-wider">{{ title }}</h2>
    <div :class="contentClass" :data-testid="dataTestid">
      <slot />
    </div>
    <slot name="form" />
  </div>
</template>

<script setup>
defineProps({
  contentClass: String,
  dataTestid: String,
  title: String,
})
</script>
