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
            <b-dropdown :disabled="replenishmentProducts.length === 0" :mobile-modal="false" aria-role="menu">
              <template #trigger="{ active }">
                <b-button :icon-right="active ? 'menu-up' : 'menu-down'" type="is-success">Export</b-button>
              </template>
              <b-dropdown-item aria-role="menuitem" custom><b>FBA Shipments</b></b-dropdown-item>
              <b-dropdown-item @click="createFba" aria-role="menuitem"><b-icon class="mr-1" icon="download"></b-icon>Bulk FBA Plan</b-dropdown-item>
              <b-dropdown-item class="flex" @click="createIndividualFbas" aria-role="menuitem"
                ><b-icon class="mr-1" icon="download"></b-icon>Individual FBA Plans</b-dropdown-item
              >
              <hr class="dropdown-divider" aria-role="menuitem" />
              <b-dropdown-item aria-role="menuitem" custom><b>Send to Amazon</b></b-dropdown-item>
              <b-dropdown-item @click="createStaWorkflow" aria-role="menuitem">
                <b-tag rounded type="is-success">New!</b-tag>
                <b-icon class="mr-1" icon="download"></b-icon>
                Send to Amazon Workflow
              </b-dropdown-item>
              <hr class="dropdown-divider" aria-role="menuitem" />
              <b-dropdown-item aria-role="menuitem" custom><b>Purchase Orders</b></b-dropdown-item>
              <b-dropdown-item @click="handleCompileDraftClick" aria-role="menuitem"
                ><b-icon class="mr-1" icon="export"></b-icon>Draft POs</b-dropdown-item
              >
            </b-dropdown>
          </b-field>
          <b-field>
            <b-dropdown :disabled="replenishmentProducts.length === 0" :mobile-modal="false" aria-role="menu">
              <template #trigger="{ active }">
                <b-button :icon-right="active ? 'menu-up' : 'menu-down'" type="is-info">Actions</b-button>
              </template>
              <b-dropdown-item aria-role="menuitem" custom><b style="white-space: nowrap">Update SKU Status</b></b-dropdown-item>
              <template v-for="classification in classifications" :key="classification.name">
                <b-dropdown-item v-if="classification.conditional" aria-role="menuitem">
                  <b-checkbox
                    class="is-flex-wrap-nowrap"
                    :indeterminate="classification.indeterminate"
                    :value="classification.value"
                    @click="
                      toggleSkuClassification(
                        classification.name,
                        replenishmentProducts.map((product) => product.sku)
                      )
                    "
                    type="is-info"
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
            <div class="title">{{ useFormatter.number(replenishmentProducts.reduce((a, c) => a + c.replenishmentQuantity, 0)) }}</div>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">Total Time</div>
            <div class="title">
              {{
                humanizeDuration(
                  replenishmentProducts.reduce(
                    (a, c) =>
                      skuProcedures[c.sku].bundling.average > 0
                        ? a + (c.replenishmentQuantity / skuProcedures[c.sku].bundling.average) * 3600 * 1000
                        : a,
                    0
                  ),
                  { round: true, units: ['h', 'm'] }
                )
              }}
              <span
                class="ml-2"
                v-if="
                  replenishmentProducts.some((product) => !skuProcedures[product.sku].bundling || skuProcedures[product.sku].bundling.average === '')
                "
              >
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
            v-model="skuInput"
            :loading="skuInputLoading"
            @icon-right-click="clearSkuInput"
            icon="magnify"
            icon-right="close-circle"
            icon-right-clickable
            pack="material-icons"
            placeholder="Search for a SKU..."
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
  const skuStates = replenishmentProducts.value.map((product) => product.sku)

  return [
    { ref: favorite, name: 'favorite', label: 'Important', conditional: true },
    { ref: dropship, name: 'dropship', label: 'Dropshipped', conditional: true },
    { ref: oversize, name: 'oversize', label: 'Oversized', conditional: true },
    { ref: fbm, name: 'fbm', label: 'FBM', conditional: true },
    { ref: canada, name: 'canada', label: 'Canada FBA', conditional: marketplaceCode === 'CA' },
    { ref: blacklist, name: 'blacklist', label: 'Blacklisted', conditional: true },
  ].map((classification) => {
    const allIncluded = skuStates.every((sku) => classification.ref.value.includes(sku))
    const someIncluded = skuStates.some((sku) => classification.ref.value.includes(sku))
    const indeterminate = someIncluded && !allIncluded

    return {
      ...classification,
      value: allIncluded,
      indeterminate: indeterminate,
    }
  })
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
