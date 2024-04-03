<template>
  <div class="flex items-center">
    <b-checkbox type="is-info" v-model="includedInventoryStatuses" :native-value="value" @click.native.stop=""></b-checkbox>
    <span class="is-relative">
      {{ status }} Inventory
      <b-icon
        :icon="icon"
        :pack="iconPack"
        both
        :size="iconSize"
        class="sort-icon"
        :class="{
          'is-desc': !isAsc,
          'is-invisible': !isCurrentSortColumn,
        }"
      />
    </span>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores'
import { storeToRefs } from 'pinia'

const props = defineProps({
  value: String,
  status: String,
  inventoryValue: [String, Number],
  icon: String,
  iconPack: String,
  iconSize: String,
  isAsc: Boolean,
  isCurrentSortColumn: Boolean,
})
const settingsStore = useSettingsStore()
const { includedInventoryStatuses } = storeToRefs(settingsStore)
</script>
