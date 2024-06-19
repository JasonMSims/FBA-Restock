<template>
  <b-sidebar @close="toggleSidebar" fullheight type="is-light" v-model="isSidebarOpen">
    <section class="section not-prose">
      <b-field label="Marketplace">
        <b-dropdown :disabled="marketplacesLoading || userPrefsLoading" :mobile-modal="false" aria-role="list" v-model="marketplaceCode">
          <template #trigger="{ active }">
            <b-button :icon-right="active ? 'menu-up' : 'menu-down'">{{ marketplaceCode }}</b-button>
          </template>
          <b-dropdown-item :key="index" :value="code" aria-role="listitem" v-for="(code, index) in marketplaceCodes">{{ code }}</b-dropdown-item>
        </b-dropdown>
      </b-field>
      <b-field grouped label="Run Rate">
        <b-field>
          <b-radio-button native-value="7d" type="is-info is-light is-outlined" v-model="runRate.duration">7 Days</b-radio-button>
          <b-radio-button native-value="30d" type="is-info is-light is-outlined" v-model="runRate.duration">30 Days</b-radio-button>
        </b-field>
        <b-field>
          <b-radio-button native-value="sku" type="is-info is-light is-outlined" v-model="runRate.type">SKU</b-radio-button>
          <b-radio-button native-value="asin" type="is-info is-light is-outlined" v-model="runRate.type">ASIN</b-radio-button>
        </b-field>
      </b-field>
      <b-field label="Status">
        <b-switch type="is-info" v-model="selectedOnly">Selected Only</b-switch>
      </b-field>
      <b-field>
        <b-switch type="is-info" v-model="favoriteOnly">Starred</b-switch>
      </b-field>
      <b-field>
        <b-switch type="is-info" v-model="dropshipOnly">Dropshipped</b-switch>
      </b-field>
      <b-field>
        <b-switch type="is-black" v-model="blacklistOnly">Blacklisted</b-switch>
      </b-field>
      <b-field label="Product Size">
        <b-radio-button native-value="all" type="is-info is-light is-outlined" v-model="productSize">All</b-radio-button>
        <b-radio-button native-value="standard" type="is-success is-light is-outlined" v-model="productSize">Standard</b-radio-button>
        <b-radio-button native-value="oversized" type="is-danger is-light is-outlined" v-model="productSize">Oversized</b-radio-button>
      </b-field>
      <b-field expanded label="Days of Cover">
        <b-numberinput
          :disabled="userPrefsLoading"
          :loading="targetDaysInputLoading"
          icon="calendar-range"
          placeholder="Target Days (FBA Inventory)"
          type="is-info"
          v-model="targetDaysInput"
        ></b-numberinput>
      </b-field>
      <b-field expanded label="On-Hand Alerts">
        <b-taginput :data="alerts" autocomplete open-on-focus ref="alertinput" v-model="filteredAlerts">
          <template v-slot="props">
            {{ props.option.message }}
          </template>
          <template #empty>All alerts are selected.</template>
          <template #selected="props">
            <b-tag
              :key="index"
              :type="alert.type"
              @close="$refs.alertinput.removeTag(index, $event)"
              closable
              rounded
              v-for="(alert, index) in props.tags"
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
        <b-select expanded v-model="tablePagination.perPage">
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
  alerts: filteredAlerts,
  blacklistOnly,
  dropshipOnly,
  favoriteOnly,
  productSize,
  runRate,
  selectedOnly,
  sidebarOpen: isSidebarOpen,
  tablePagination,
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
    width: 25rem !important;
    z-index: 999 !important;
  }
}
</style>
