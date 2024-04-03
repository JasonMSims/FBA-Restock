import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref({
    excessFba: { message: 'Excess FBA Inventory', type: 'is-warning' },
    inboundFba: { message: 'Inventory Inbound', type: 'is-info' },
    lowFba: { message: 'Low FBA Inventory', type: 'is-warning' },
    moderateFba: { message: 'Moderate FBA Inventory', type: 'is-warning' },
    noFba: { message: 'No FBA Inventory', type: 'is-danger' },
    noLocal: { message: 'No Local Inventory', type: 'is-danger' },
    noSales: { message: 'No Sales (30 Days)', type: 'is-primary' },
    optimalFba: { message: 'Optimal FBA Inventory', type: 'is-success' },
  })

  return { alerts }
})
