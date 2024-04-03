<template>
  <b-sidebar v-model="isSidebarOpen" @close="toggleSidebar" fullheight type="is-light">
    <section class="section">
      <b-field label="Marketplace">
        <b-dropdown v-model="marketplaceCode" :disabled="marketplacesLoading || userPrefsLoading" :mobile-modal="false" aria-role="list">
          <template #trigger="{ active }">
            <b-button :icon-right="active ? 'menu-up' : 'menu-down'">{{ marketplaceCode }}</b-button>
          </template>
          <b-dropdown-item v-for="(code, index) in marketplaceCodes" :key="index" :value="code" aria-role="listitem">{{ code }}</b-dropdown-item>
        </b-dropdown>
      </b-field>
      <b-field grouped label="Run Rate">
        <b-field>
          <b-radio-button v-model="runRate.duration" native-value="7d" type="is-info is-light is-outlined">7 Days</b-radio-button>
          <b-radio-button v-model="runRate.duration" native-value="30d" type="is-info is-light is-outlined">30 Days</b-radio-button>
        </b-field>
        <b-field>
          <b-radio-button v-model="runRate.type" native-value="sku" type="is-info is-light is-outlined">SKU</b-radio-button>
          <b-radio-button v-model="runRate.type" native-value="asin" type="is-info is-light is-outlined">ASIN</b-radio-button>
        </b-field>
      </b-field>
      <b-field label="Status">
        <b-switch v-model="selectedOnly" type="is-info">Selected Only</b-switch>
      </b-field>
      <b-field>
        <b-switch v-model="favoriteOnly" type="is-info">Starred</b-switch>
      </b-field>
      <b-field>
        <b-switch v-model="dropshipOnly" type="is-info">Dropshipped</b-switch>
      </b-field>
      <b-field>
        <b-switch v-model="blacklistOnly" type="is-black">Blacklisted</b-switch>
      </b-field>
      <b-field label="Product Size">
        <b-radio-button v-model="productSize" native-value="all" type="is-info is-light is-outlined">All</b-radio-button>
        <b-radio-button v-model="productSize" native-value="standard" type="is-success is-light is-outlined">Standard</b-radio-button>
        <b-radio-button v-model="productSize" native-value="oversized" type="is-danger is-light is-outlined">Oversized</b-radio-button>
      </b-field>
      <b-field expanded label="Days of Cover">
        <b-numberinput
          v-model="targetDaysInput"
          :disabled="userPrefsLoading"
          :loading="targetDaysInputLoading"
          icon="calendar-range"
          placeholder="Target Days (FBA Inventory)"
          type="is-info"
        ></b-numberinput>
      </b-field>
      <b-field expanded label="On-Hand Alerts">
        <b-taginput v-model="filteredAlerts" :data="alerts" autocomplete open-on-focus ref="alertinput">
          <template slot-scope="props">
            {{ props.option.message }}
          </template>
          <template #empty>All alerts are selected.</template>
          <template #selected="props">
            <b-tag
              v-for="(alert, index) in props.tags"
              :key="index"
              :type="alert.type"
              @close="$refs.alertinput.removeTag(index, $event)"
              closable
              rounded
            >
              {{ alert.message }}
            </b-tag>
          </template>
        </b-taginput>
      </b-field>
      <!-- <pre>
      <b>userPreferences:</b>
      {{ JSON.stringify(userPreferences, null, 2) }}
      </pre> -->
      <b-field label="SKUs per Page" type="is-info">
        <b-select v-model="tablePagination.perPage" expanded>
          <option value="50">50 per Page</option>
          <option value="100">100 per Page</option>
          <option value="250">250 per Page</option>
          <option value="500">500 per Page</option>
        </b-select>
      </b-field>
    </section>
  </b-sidebar>
</template>

<script setup>
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAlertStore, useMarketplaceStore, useUIStore, useUserStore } from '../stores'

const uiStore = useUIStore()
const alertStore = useAlertStore()
const userStore = useUserStore()
const marketplaceStore = useMarketplaceStore()

const updateTargetDaysInput = debounce((input) => {
  input = !isNaN(input) ? Number(input) : input
  uiStore.targetDays = input
  targetDaysInputLoading.value = false
}, 1000)
const targetDaysInputLoading = ref(false)
const targetDaysInput = computed({
  get: () => uiStore.targetDays,
  set: (input) => {
    targetDaysInputLoading.value = true
    updateTargetDaysInput(input)
  },
})

const {
  blacklistOnly,
  dropshipOnly,
  favoriteOnly,
  selectedOnly,
  productSize,
  runRate,
  tablePagination,
  alerts: filteredAlerts,
  sidebarOpen: isSidebarOpen,
} = storeToRefs(uiStore)

const alerts = computed(() => Object.values(alertStore.alerts).filter((alert) => filteredAlerts.value.indexOf(alert) < 0))

const { marketplaceCode, marketplaceCodes, marketplacesLoading } = storeToRefs(marketplaceStore)

const { userPrefsLoading } = storeToRefs(userStore)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style lang="scss">
.b-sidebar {
  .sidebar-content {
    width: 25rem;
    z-index: 999 !important;
  }
}
</style>
