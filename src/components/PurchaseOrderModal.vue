<template>
  <b-modal v-model="isDraftActive" width="50vw">
    <div class="card">
      <div class="card-content">
        <b-table
          :checked-rows="checkedPoRows"
          :data="draftPurchaseOrders"
          :loading="isDraftLoading"
          @check="onRowChecked"
          checkable
          height="40vh"
          hoverable
          scrollable
          sticky-checkbox
          sticky-header
        >
          <b-table-column v-slot="props" field="PoNumber" label="PO #">
            <b-input
              v-model="props.row.PoNumber"
              @icon-right-click="() => (props.row.PoNumber = '')"
              custom-class="w-fit"
              expanded
              icon-right="close-circle"
              icon-right-clickable
              placeholder="SkuVault will auto-generate if left blank"
              type="text"
            >
            </b-input>
            <b-loading v-model="props.row.loading" :is-full-page="false"></b-loading>
            <b-notification v-if="props.row.notification" :type="props.row.notification.type">
              {{ props.row.notification.message }}
            </b-notification>
          </b-table-column>
          <b-table-column v-slot="props" colspan="2" field="SupplierName" label="Supplier">
            <div class="content py-4" style="position: relative">
              {{ props.row.SupplierName }}
            </div>
          </b-table-column>
          <b-table-column field="LineItems" label="Products">
            <template v-slot:header>
              <div class="level top">
                <div class="level-left pr-5">
                  <div class="level-item">SKU</div>
                </div>
                <div class="level-right">
                  <div class="level-item">Quantity</div>
                </div>
              </div>
            </template>
            <template v-slot="props">
              <div class="level top" v-for="item in props.row.LineItems" :key="item.SKU">
                <div class="level-left pr-5">
                  <div class="level-item">{{ item.SKU }}</div>
                </div>
                <div class="level-right">
                  <div class="level-item">{{ item.Quantity }}</div>
                </div>
              </div>
            </template>
          </b-table-column>
          <b-table-column v-slot="props" field="ShipToWarehouse" label="Ship To Warehouse">
            <b-select v-model="props.row.ShipToWarehouse">
              <option v-for="warehouse in warehouses" :key="warehouse.Id" :value="warehouse.Code">{{ warehouse.Code }}</option>
            </b-select>
          </b-table-column>
        </b-table>
      </div>
      <div class="card-footer">
        <div class="card-footer-item justify-start space-x-4">
          <b-button @click="handleExportPurchaseOrders" type="is-success">Export Purchase Orders</b-button>
          <b-button @click="handleCreatePurchaseOrders" type="is-info">Create Purchase Orders</b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script setup>
import { usePurchaseOrderStore, useWarehouseStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const purchaseOrderStore = usePurchaseOrderStore()
const warehouseStore = useWarehouseStore()

const { draftPurchaseOrders, isDraftLoading, isDraftActive } = storeToRefs(purchaseOrderStore)
const { createPurchaseOrders, exportPurchaseOrders } = purchaseOrderStore
const { warehouses } = storeToRefs(warehouseStore)

const selectedSuppliers = ref([])

const onRowChecked = (checkedRows, row) => {
  const isRowChecked = checkedRows.some((checkedRow) => checkedRow.SupplierName === row.SupplierName)
  if (isRowChecked) {
    if (!selectedSuppliers.value.includes(row.SupplierName)) {
      selectedSuppliers.value.push(row.SupplierName)
    }
  } else {
    selectedSuppliers.value = selectedSuppliers.value.filter((name) => name !== row.SupplierName)
  }
}

const checkedPoRows = computed(() => {
  return draftPurchaseOrders.value.filter((order) => selectedSuppliers.value.includes(order.SupplierName))
})

const handleExportPurchaseOrders = () => {
  exportPurchaseOrders(selectedSuppliers.value)
}

const handleCreatePurchaseOrders = () => {
  createPurchaseOrders(selectedSuppliers.value)
}
</script>
