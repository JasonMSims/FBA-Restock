<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <b-field grouped>
          <b-field>
            <b-button @click="toggleSidebar">
              <settings-icon :class="['h-6 w-6 text-slate-700']" />
              <!-- <b-icon icon="cog"></b-icon> -->
            </b-button>
          </b-field>
          <b-field>
            <b-dropdown :disabled="replenishmentProductKeys.length === 0" :mobile-modal="false" aria-role="menu">
              <template #trigger="{ active }">
                <b-button :icon-right="active ? 'menu-up' : 'menu-down'" type="is-success">Export</b-button>
              </template>
              <b-dropdown-item aria-role="menuitem" custom><b>FBA Shipments</b></b-dropdown-item>
              <b-dropdown-item @click="createFba" aria-role="menuitem"><b-icon class="mr-1" icon="download"></b-icon>Bulk FBA Plan</b-dropdown-item>
              <b-dropdown-item @click="createIndividualFbas" aria-role="menuitem" class="flex"
                ><b-icon class="mr-1" icon="download"></b-icon>Individual FBA Plans</b-dropdown-item
              >
              <hr aria-role="menuitem" class="dropdown-divider" />
              <b-dropdown-item aria-role="menuitem" custom><b>Send to Amazon</b></b-dropdown-item>
              <b-dropdown-item @click="createStaWorkflow" aria-role="menuitem">
                <b-tag rounded type="is-success">New!</b-tag>
                <b-icon class="mr-1" icon="download"></b-icon>
                Send to Amazon Workflow
              </b-dropdown-item>
              <hr aria-role="menuitem" class="dropdown-divider" />
              <b-dropdown-item aria-role="menuitem" custom><b>Purchase Orders</b></b-dropdown-item>
              <b-dropdown-item @click="handleCompileDraftClick" aria-role="menuitem"
                ><b-icon class="mr-1" icon="export"></b-icon>Draft POs</b-dropdown-item
              >
            </b-dropdown>
          </b-field>
          <b-field>
            <b-dropdown :disabled="replenishmentProductKeys.length === 0" :mobile-modal="false" aria-role="menu">
              <template #trigger="{ active }">
                <b-button :icon-right="active ? 'menu-up' : 'menu-down'" type="is-info">Actions</b-button>
              </template>
              <b-dropdown-item aria-role="menuitem" custom><b style="white-space: nowrap">Update SKU Status</b></b-dropdown-item>
              <template :key="classification.name" v-for="classification in classifications">
                <b-dropdown-item aria-role="menuitem" v-if="classification.conditional">
                  <b-checkbox
                    :indeterminate="classification.indeterminate"
                    @click="toggleSkuClassification(classification.name, replenishmentProductKeys)"
                    class="is-flex-wrap-nowrap"
                    type="is-info"
                    v-model="classification.value"
                    >{{ classification.label }}</b-checkbox
                  >
                </b-dropdown-item>
              </template>
            </b-dropdown>
          </b-field>
        </b-field>
      </div>
    </div>
    <div class="level-item">
      <nav class="level w-full">
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">Total Units</div>
            <div class="title">
              {{ totalUnits }}
            </div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">Total Time</div>
            <div class="title">
              {{ totalTime }}
              <span class="ml-2" v-if="missingBundlingData">
                <b-tooltip label="Some selected SKUs do not have bundling averages." type="is-danger is-light">
                  <b-icon icon="exclamation-circle" pack="fas" size="is-small" type="is-danger" />
                </b-tooltip>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="level-right">
      <b-field class="is-field-right">
        <div class="control">
          <b-input
            :loading="skuInputLoading"
            @icon-right-click="clearSkuInput"
            icon="magnify"
            icon-right="close-circle"
            icon-right-clickable
            pack="material-icons"
            placeholder="Search for a SKU..."
            v-model="skuInput"
          ></b-input>
          <!-- <pre>
          skuInput: {{ skuInput }}
          </pre> -->
        </div>
      </b-field>
    </div>
  </div>
</template>
<script setup>
import { useFileDownload, useFormatter, useGenerateServerData } from '@/composables'
import { fbaService } from '@/js/services'
import { useClassificationStore, useMarketplaceStore, usePurchaseOrderStore, useReplenishmentStore, useShippingStore, useUIStore } from '@/stores'
import { AdjustmentsHorizontalIcon as SettingsIcon } from '@heroicons/vue/24/outline'
import humanizeDuration from 'humanize-duration'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, toRefs } from 'vue'

const classificationStore = useClassificationStore()
const marketplaceStore = useMarketplaceStore()
const purchaseOrderStore = usePurchaseOrderStore()
const replenishmentStore = useReplenishmentStore()
const shippingStore = useShippingStore()
const uiStore = useUIStore()

const updateSkuInput = debounce((input) => {
  uiStore.sku = input
  skuInputLoading.value = false
}, 1000)
const clearSkuInput = () => (uiStore.sku = '')
const skuInputLoading = ref(false)
const skuInput = computed({
  get: () => uiStore.sku,
  set: (input) => {
    skuInputLoading.value = true
    updateSkuInput(input)
  },
})

const { sidebarOpen: isSidebarOpen } = storeToRefs(uiStore)
const { marketplaceCode } = storeToRefs(marketplaceStore)

const { toggleSkuClassification } = classificationStore
const { blacklist, canada, dropship, favorite, fbm, oversize } = toRefs(classificationStore.classifications)
const { replenishmentProducts } = storeToRefs(replenishmentStore)
const { skuProcedures } = storeToRefs(shippingStore)

const classifications = computed(() => {
  const skuStates = Array.from(replenishmentProducts.value.keys())
  return [
    { conditional: true, label: 'Important', name: 'favorite', ref: favorite.value },
    { conditional: true, label: 'Dropshipped', name: 'dropship', ref: dropship.value },
    { conditional: true, label: 'Oversized', name: 'oversize', ref: oversize.value },
    { conditional: true, label: 'FBM', name: 'fbm', ref: fbm.value },
    { conditional: marketplaceCode === 'CA', label: 'Canada FBA', name: 'canada', ref: canada.value },
    { conditional: true, label: 'Blacklisted', name: 'blacklist', ref: blacklist.value },
  ].map((classification) => {
    const allIncluded = skuStates.every((sku) => classification.ref.includes(sku))
    const someIncluded = skuStates.some((sku) => classification.ref.includes(sku))
    const indeterminate = someIncluded && !allIncluded

    return {
      ...classification,
      indeterminate,
      value: allIncluded,
    }
  })
})

const replenishmentProductKeys = computed(() => Array.from(replenishmentProducts.value.keys()))
const replenishmentProductValues = computed(() => Array.from(replenishmentProducts.value.values()))
const totalUnits = computed(() => {
  return useFormatter.number(replenishmentProductValues.value.reduce((a, c) => a + c.replenishmentQuantity, 0))
})
const totalTime = computed(() => {
  return humanizeDuration(
    replenishmentProductKeys.value.reduce(
      (a, c) =>
        skuProcedures.value[c]?.bundling.average > 0
          ? a + (replenishmentProducts.value.get(c).replenishmentQuantity / skuProcedures.value[c]?.bundling.average) * 3600 * 1000
          : a,
      0
    ),
    { round: true, units: ['h', 'm'] }
  )
})
const missingBundlingData = computed(() => {
  return replenishmentProductKeys.value.some(
    (product) => !skuProcedures.value[product]?.bundling || skuProcedures.value[product]?.bundling.average === ''
  )
})

const { compileDraftPurchaseOrders } = purchaseOrderStore
const { fbaData, poData } = useGenerateServerData()
const { downloadFile } = useFileDownload()

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Send to Amazon / FBA Methods
const createStaWorkflow = async () => {
  try {
    const data = await fbaService.createStaWorkflow(fbaData.value)
    downloadFile(data.bytes, data.filename, 'text/tsv;charset=utf-8')
  } catch (error) {
    console.error('Failed to create STA workflow:', error)
  }
}
const createFba = async () => {
  try {
    const data = await fbaService.createFba(fbaData.value)
    downloadFile(data.bytes, data.filename, 'text/tsv;charset=utf-8')
  } catch (error) {
    console.error('Failed to create FBA:', error)
  }
}
const createIndividualFbas = async () => {
  try {
    const data = await fbaService.createIndividualFbas(fbaData.value)
    downloadFile(data.bytes, data.filename, 'application/octet-stream')
  } catch (error) {
    console.error('Failed to create individual FBAs:', error)
  }
}

const handleCompileDraftClick = async () => {
  await compileDraftPurchaseOrders(poData.value)
}
</script>

<style lang="scss" scoped>
.is-field-right {
  margin-left: auto;
}
</style>
