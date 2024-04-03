<template>
  <div :class="['tags flex items-center justify-center', attached ? 'attached' : 'flex-wrap']">
    <slot />
  </div>
</template>
<script setup>
defineProps({ attached: Boolean })
</script>
<style lang="postcss" scoped>
.attached {
  & :deep() .tag {
    @apply mx-0;
  }
  & :deep() .tag:not(:first-child) {
    @apply rounded-l-none;
  }
  & :deep() .tag:not(:last-child) {
    @apply rounded-r-none;
    @apply border-r-0;
  }
}
</style>
