<template>
  <app-sidebar />
  <section class="section flex h-screen flex-col justify-start">
    <actions-panel />
    <section class="main flex flex-auto flex-col overflow-auto">
      <div class="relative h-full w-full" v-if="pageLoading">
        <!-- <b-progress size="is-small" type="is-info" :value="(filters.page.progress.loaded / filters.page.progress.total) * 100"></b-progress> -->
        <b-loading v-model="pageLoading" :is-full-page="false"></b-loading>
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
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import 'buefy/dist/buefy.css'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const { productsLoading } = storeToRefs(productStore)
const { inventoryLoading } = storeToRefs(inventoryStore)

const pageLoading = computed(() => {
  return inventoryLoading.value || productsLoading.value
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
