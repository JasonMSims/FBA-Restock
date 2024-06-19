<template>
  <b-modal v-model="isDraftActive" width="50vw">
    <div class="card">
      <div class="card-content">
        <b-table
          :checked-rows="checkedPoRows"
          :data="draftPurchaseOrders"
          :loading="isDraftLoading"
          @check="onRowChecked"
          @check-all="onAllRowsChecked"
          checkable
          height="40vh"
          hoverable
          scrollable
          sticky-checkbox
          sticky-header
        >
          <b-table-column field="PoNumber" label="PO #" v-slot="props">
            <b-input
              @icon-right-click="() => (props.row.PoNumber = '')"
              custom-class="w-fit min-w-52"
              expanded
              icon-right="close-circle"
              icon-right-clickable
              placeholder="SkuVault will auto-generate if left blank"
              type="text"
              v-model="props.row.PoNumber"
            >
            </b-input>
            <b-loading :is-full-page="false" v-model="props.row.loading"></b-loading>
            <b-notification :type="props.row.notification.type" v-if="props.row.notification">
              {{ props.row.notification.message }}
            </b-notification>
          </b-table-column>
          <b-table-column colspan="2" field="SupplierName" label="Supplier" v-slot="props">
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
              <div :key="item.SKU" class="level top" v-for="item in props.row.LineItems">
                <div class="level-left pr-5">
                  <div class="level-item">{{ item.SKU }}</div>
                </div>
                <div class="level-right">
                  <div class="level-item">{{ item.Quantity }}</div>
                </div>
              </div>
            </template>
          </b-table-column>
          <b-table-column field="ShipToWarehouse" label="Ship To Warehouse" v-slot="props">
            <b-select v-model="props.row.ShipToWarehouse">
              <option :key="warehouse.Id" :value="warehouse.Code" v-for="warehouse in warehouses">{{ warehouse.Code }}</option>
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

const { draftPurchaseOrders, isDraftActive, isDraftLoading } = storeToRefs(purchaseOrderStore)
const { createPurchaseOrders, exportPurchaseOrders } = purchaseOrderStore
const { warehouses } = storeToRefs(warehouseStore)

const selectedSuppliers = ref([])

const onRowChecked = (checkedList, row) => {
  if (!row) return
  const isRowChecked = checkedList.some((checkedRow) => checkedRow.SupplierName === row.SupplierName)
  if (isRowChecked) {
    if (!selectedSuppliers.value.includes(row.SupplierName)) {
      selectedSuppliers.value.push(row.SupplierName)
    }
  } else {
    selectedSuppliers.value = selectedSuppliers.value.filter((name) => name !== row.SupplierName)
  }
}

const onAllRowsChecked = (checkedList) => {
  if (checkedList.length > 0) {
    selectedSuppliers.value = checkedList.map((row) => row.SupplierName)
  } else {
    selectedSuppliers.value = []
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
