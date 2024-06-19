<template>
  <div class="flex items-center">
    <b-checkbox :native-value="value" @click.stop="" type="is-info" v-model="includedInventoryStatuses"></b-checkbox>
    <span class="is-relative">
      {{ status }} Inventory
      <b-icon
        :class="{
          'is-desc': !isAsc,
          'is-invisible': !isCurrentSortColumn,
        }"
        :icon="icon"
        :pack="iconPack"
        :size="iconSize"
        both
        class="sort-icon"
      />
    </span>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores'
import { storeToRefs } from 'pinia'

defineProps({
  icon: String,
  iconPack: String,
  iconSize: String,
  inventoryValue: [String, Number],
  isAsc: Boolean,
  isCurrentSortColumn: Boolean,
  status: String,
  value: String,
})
const settingsStore = useSettingsStore()
const { includedInventoryStatuses } = storeToRefs(settingsStore)
</script>
