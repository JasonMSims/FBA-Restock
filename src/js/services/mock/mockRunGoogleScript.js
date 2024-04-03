import compileData from './data/compileData.json'
import userProperties from './data/userProperties.json'
import scriptProperties from './data/scriptProperties.json'
import marketplaces from './data/marketplaces.json'
import skuvaultWarehouses from './data/skuvaultWarehouses.json'
import productsAndKits from './data/productsAndKits.json'
import skuProcedures from './data/skuProcedures.json'
import fbaInventory from './data/fbaInventory.json'

const mockFunctions = {
  create_sta_workflow: (params) => {
    return { success: true, message: '[MOCK] STA Workflow created successfully' }
  },
  create_fba: (params) => {
    return { success: true, message: '[MOCK] FBA created successfully' }
  },
  create_individual_fbas: (params) => {
    return { success: true, message: '[MOCK] Individual FBAs created successfully' }
  },
  compile_draft_purchase_orders: (params) => {
    // Return a success message or similar response
    // return { success: true, message: '[MOCK] Draft Purchase Orders compiled successfully' }
    const response = [
      {
        LineItems: [{ SKU: 'ALR-10012', Quantity: 1 }],
        ShipToWarehouse: 'P7HQ',
        SupplierName: 'Allerpet Inc',
        PoNumber: 'DRAFT_a96a3f96-9356-4118-9824-e85730001917',
      },
    ]
    return response
  },
  create_purchase_order: (params) => {
    // Return a success message or similar response
    // return { success: true, message: '[MOCK] Purchase order created successfully' }
    const response = {
      notification: {
        type: 'is-success',
        message: 'PO# DRAFT_d55db5fb-1c0c-40a1-bf22-59687f262bd3 has been created',
      },
      LineItems: [{ SKU: 'ALR-MITT-BLUE', Quantity: 77 }],
      ShipToWarehouse: 'P7HQ',
      SupplierName: 'Hebei Laibang Import and Export Trade Co Ltd',
      PoNumber: 'DRAFT_d55db5fb-1c0c-40a1-bf22-59687f262bd3',
    }
    return response
  },
  export_purchase_order: (params) => {
    // Return a success message or similar response
    // return { success: true, message: '[MOCK] Purchase order exported successfully' }
    const response = {
      bytes: [
        83, 117, 112, 112, 108, 105, 101, 114, 78, 97, 109, 101, 9, 65, 108, 108, 101, 114, 112, 101, 116, 32, 73, 110, 99, 10, 83, 104, 105, 112, 84,
        111, 87, 97, 114, 101, 104, 111, 117, 115, 101, 9, 80, 55, 72, 81, 10, 10, 83, 75, 85, 9, 81, 117, 97, 110, 116, 105, 116, 121, 10, 65, 76,
        82, 45, 49, 48, 48, 49, 50, 9, 49,
      ],
      filename: 'DRAFT_PO_DRAFT_2eaa0e12-8654-49eb-a673-483ab123cd70.tsv',
    }
    return response
  },
  get_script_property: (propertyName) => {
    let property = scriptProperties[propertyName]
    return property
  },
  get_script_properties: (params) => {
    // Return specific properties based on params
    return params.reduce((acc, propName) => {
      acc[propName] = scriptProperties[propName]
      return acc
    }, {})
  },
  get_user_property: (property) => {
    property = userProperties[property]
    return property
  },
  get_marketplaces: () => {
    return marketplaces
  },
  get_skuvault_warehouses: () => {
    return skuvaultWarehouses
  },
  compile_data: () => {
    return compileData
  },
  get_products_and_kits: () => {
    return productsAndKits
  },
  get_fba_inventory: () => {
    return fbaInventory
  },
  get_sku_procedure: () => {
    return skuProcedures
  },
  set_script_property: (params) => {
    return { success: true, message: '[MOCK] Script property set successfully' }
  },
  set_user_property: (params) => {
    return { success: true, message: '[MOCK] User property set successfully' }
  },
}

export const mockRunGoogleScript = ({ serverFunctionName, params = [] }) => {
  return mockFunctions[serverFunctionName](...params)
}
