<template>
  <app-sidebar />
  <section class="section not-prose flex h-screen flex-col justify-start">
    <actions-panel />
    <section class="main flex flex-auto flex-col">
      <div class="relative h-full w-full" v-if="pageLoading">
        <!-- <b-progress size="is-small" type="is-info" :value="(filters.page.progress.loaded / filters.page.progress.total) * 100"></b-progress> -->
        <b-loading :is-full-page="false" v-model="pageLoading"></b-loading>
      </div>
      <template v-else>
        <sku-table />
        <purchase-order-modal />
      </template>
      <!-- <pre>
        </pre> -->
    </section>
  </section>
</template>

<script setup>
import { ActionsPanel, AppSidebar, PurchaseOrderModal, SkuTable } from '@/components'
import { useInventoryStore, useProductStore } from '@/stores'
import 'buefy/dist/buefy.css'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted } from 'vue'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const { productsLoading } = storeToRefs(productStore)
const { inventoryLoading } = storeToRefs(inventoryStore)

const pageLoading = computed(() => {
  return inventoryLoading.value || productsLoading.value
})

onMounted(() => {
  document.querySelector('html').classList.add('bg-slate-50')
  document.querySelector('body').className = ''
})

onUnmounted(() => {
  document.querySelector('html').classList.remove('bg-slate-50')
  document.querySelector('body').classList.add('prose', 'prose-sm', 'prose-slate', 'max-w-none', 'bg-white', 'dark:prose-invert', 'dark:bg-slate-800')
})
</script>

<style lang="scss">
:root {
  font-size: 14px;
}
html,
body {
  height: 100vh;
}
#app {
  height: 100vh;
}

/* Card */
.card {
  overflow: hidden;
}

.select select {
  background-image: none;
}

pre {
  max-height: 20vh;
}
</style>
