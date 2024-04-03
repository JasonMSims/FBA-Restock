import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { purchaseOrderService } from '@/js/services'
import { useFileDownload } from '@/composables'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  const draftPurchaseOrders = ref([])
  const isDraftLoading = ref(false)
  const isDraftActive = ref(false)

  const { downloadFile } = useFileDownload()

  const compileDraftPurchaseOrders = async (poData) => {
    isDraftLoading.value = true
    isDraftActive.value = true
    draftPurchaseOrders.value = []
    try {
      const data = await purchaseOrderService.compileDraftPos(poData)
      draftPurchaseOrders.value = data
    } catch (error) {
      console.error(`Failed to create draft PO:`, error)
    } finally {
      await nextTick()
      isDraftLoading.value = false
    }
  }

  const exportPurchaseOrders = async (selectedSuppliers) => {
    for (const supplierName of selectedSuppliers) {
      const orderIndex = draftPurchaseOrders.value.findIndex((p) => p.SupplierName === supplierName)
      if (orderIndex === -1) continue // If order is not found, continue to the next iteration

      try {
        const data = await purchaseOrderService.exportPos([draftPurchaseOrders.value[orderIndex]])

        const updatedOrder = { ...draftPurchaseOrders.value[orderIndex], notification: data.notification }
        draftPurchaseOrders.value = [
          ...draftPurchaseOrders.value.slice(0, orderIndex),
          updatedOrder,
          ...draftPurchaseOrders.value.slice(orderIndex + 1),
        ]
        downloadFile(data.bytes, data.filename, 'text/tsv;charset=utf-8')
      } catch (error) {
        console.error(`Failed to export PO:`, error)
      } finally {
        await nextTick()
      }
    }
  }

  // Creates Purchase Orders
  const createPurchaseOrders = async (selectedSuppliers) => {
    for (const supplierName of selectedSuppliers) {
      const orderIndex = draftPurchaseOrders.value.findIndex((p) => p.SupplierName === supplierName)
      if (orderIndex === -1) continue // If order is not found, continue to the next iteration

      try {
        const data = await purchaseOrderService.createPos([draftPurchaseOrders.value[orderIndex]])

        const updatedOrder = { ...draftPurchaseOrders.value[orderIndex], notification: data.notification }
        draftPurchaseOrders.value = [
          ...draftPurchaseOrders.value.slice(0, orderIndex),
          updatedOrder,
          ...draftPurchaseOrders.value.slice(orderIndex + 1),
        ]
      } catch (error) {
        console.error(`Failed to create the purchase orders:`, error)
      } finally {
        await nextTick()
      }
    }
  }

  return {
    draftPurchaseOrders,
    isDraftLoading,
    isDraftActive,
    compileDraftPurchaseOrders,
    exportPurchaseOrders,
    createPurchaseOrders,
  }
})
