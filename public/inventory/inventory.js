const SPAPI = new AmazonSellingPartnerAPI.API()
const marketplaces = SPAPI.service.getStorage().getValue('marketplaces')

const user = Session.getActiveUser().getEmail()

let user_preferences = JSON.parse(PropertiesService.getUserProperties().getProperty('user_preferences')) || {}

const property_update = false

const init_props = [
  { property: 'marketplaceCode', value: 'US' },
  // { property: 'marketplaces', value: marketplaces },
]

init_props.forEach(({ property, value }) => {
  if (!user_preferences[property] || property_update) {
    console.log(`Initializing ${property} for ${user}`)
    user_preferences[property] = value
    PropertiesService.getUserProperties().setProperty('user_preferences', JSON.stringify(user_preferences))
  }
})

var marketplace = marketplaces[user_preferences.marketplaceCode]

function get_marketplaces() {
  return marketplaces
}

function get_fba_orders() {
  try {
    let orders_sheet = SpreadsheetApp.openById('1yLtlgQ_RCTSy9MnSRi86dUu8Us29xukWcgazkZlNm8c')
    let orders = {}

    let monthly_orders = orders_sheet.getSheetByName('Monthly Aggregate').getDataRange().getValues()
    orders = process_orders(monthly_orders, orders, '30d')

    let weekly_orders = orders_sheet.getSheetByName('Weekly Aggregate').getDataRange().getValues()
    orders = process_orders(weekly_orders, orders, '7d')

    return orders
  } catch (error) {
    console.error(`Error in get_fba_orders: ${error}`)
    return {}
  }
}

function process_orders(data, orders, timeframe) {
  let headers = data.shift()
  data
    .filter((order) => order[headers.indexOf('Sales Channel')].toLowerCase() === marketplace.url.toLowerCase())
    .forEach((order) => {
      // Process SKU
      let sku = order[headers.indexOf('SKU')]
      if (!orders[sku]) orders[sku] = { units_sold: { '7d': 0, '30d': 0 } }
      orders[sku]['units_sold'][timeframe] = order[headers.indexOf('Quantity')]

      // Process ASIN
      let asin = order[headers.indexOf('ASIN')]
      if (!orders[asin]) orders[asin] = { units_sold: { '7d': 0, '30d': 0 } }
      orders[asin]['units_sold'][timeframe] += order[headers.indexOf('Quantity')]
    })
  return orders
}

// function get_fba_inventory() {
//   console.log(`Starting get_fba_inventory`)
//   return new Promise((resolve, reject) => {
//     try {
//       let fba = SpreadsheetApp.openById('1TeMF6RFq1xRTM8Y8vhovCI5YvPqeOSnaHYgLW4sTLvU')
//         .getSheetByName(marketplace.code.toUpperCase())
//         .getDataRange()
//         .getValues()
//         .slice(1)
//         .filter((sku) => sku[4] !== 'Unknown')
//       console.time(`get fba_ orders`)
//       let orders = get_fba_orders()
//       console.timeEnd(`get fba orders`)
//       console.time(`get dimensions`)
//       let dimensions = get_dimensions()
//       console.timeEnd(`get dimensions`)
//       const data = fba.reduce((o, sku) => {
//         let units_sold = {
//           sku: !orders[sku[0]] ? { '7d': 0, '30d': 0 } : orders[sku[0]].units_sold,
//           asin: !orders[sku[2]] ? { '7d': 0, '30d': 0 } : orders[sku[2]].units_sold,
//         }
//         o[sku[0]] = {
//           ...{
//             fnsku: sku[1],
//             asin: sku[2],
//             price: sku[5],
//             units_sold: units_sold,
//             inventory: {
//               fulfillable: sku[10],
//               reserved: sku[12],
//               inbound: { working: sku[15], shipped: sku[16], receiving: sku[17] },
//               researching: sku[18],
//               unsellable: sku[11],
//               total: sku[13],
//             },
//           },
//           ...dimensions[sku[2]],
//         }
//         return o
//       }, {})
//       resolve(data)
//     } catch (error) {
//       console.error(`Error in get_fba_inventory: ${error}`)
//       reject(error)
//       // return {}
//     }
//   })
// }

function get_fba_inventory() {
  console.log(`Starting get_fba_inventory`)

  try {
    let fba = SpreadsheetApp.openById('1TeMF6RFq1xRTM8Y8vhovCI5YvPqeOSnaHYgLW4sTLvU')
      .getSheetByName(marketplace.code.toUpperCase())
      .getDataRange()
      .getValues()
      .slice(1)
      .filter((sku) => sku[4] !== 'Unknown')
    console.time(`get fba_ orders`)
    let orders = get_fba_orders()
    console.timeEnd(`get fba orders`)
    console.time(`get dimensions`)
    let dimensions = get_dimensions()
    console.timeEnd(`get dimensions`)
    const data = fba.reduce((o, sku) => {
      let units_sold = {
        sku: !orders[sku[0]] ? { '7d': 0, '30d': 0 } : orders[sku[0]].units_sold,
        asin: !orders[sku[2]] ? { '7d': 0, '30d': 0 } : orders[sku[2]].units_sold,
      }
      o[sku[0]] = {
        ...{
          fnsku: sku[1],
          asin: sku[2],
          price: sku[5],
          units_sold: units_sold,
          inventory: {
            fulfillable: sku[10],
            reserved: sku[12],
            inbound: { working: sku[15], shipped: sku[16], receiving: sku[17] },
            researching: sku[18],
            unsellable: sku[11],
            total: sku[13],
          },
        },
        ...dimensions[sku[2]],
      }
      return o
    }, {})

    DriveApp.createFile('fba_inventory.json', JSON.stringify(data))

    return data
  } catch (error) {
    console.error(`Error in get_fba_inventory: ${error}`)
    return {}
  }
}

function get_amazon_catalog_items(asins, instance) {
  try {
    let response = with_retry(
      SPAPI.catalog.searchCatalogItems.bind(SPAPI.catalog), // API function
      [{ identifiersType: 'ASIN', identifiers: asins, marketplaceIds: marketplace.id, includedData: ['dimensions'], pageSize: 20 }], // Arguments
      5, // Max attempts
      500 // Initial delay in milliseconds
    )
    return response
  } catch (error) {
    console.error(`Error in get_amazon_catalog_items after retries were attempted: ${error}`)
    return null
  }
}

function with_retry(api_function, args, max_attempts, delay) {
  for (let attempt = 1; attempt <= max_attempts; attempt++) {
    try {
      let response = api_function(...args)
      return response
    } catch (response) {
      if (attempt === max_attempts || !has_retryable_error(response)) {
        throw response
      }
      let wait = Math.pow(2, attempt - 1) * delay
      console.log(`Rate limited on an API request. Waiting ${wait}ms.`)
      Utilities.sleep(wait)
    }
  }
}

function has_retryable_error(response) {
  const retryable_response_codes = [429, 503]
  const retryable_error_codes = ['QuotaExceeded']
  if (response.getResponseCode && retryable_response_codes.includes(response.getResponseCode())) {
    return true
  }
  let is_retryable = false
  try {
    let error_obj = JSON.parse(response.getContentText())
    if (error_obj && error_obj.errors) {
      is_retryable = error_obj.errors.some((e) => retryable_error_codes.includes(e.code))
    }
  } catch (error) {
    console.error(`Error parsing the response error message: ${error}`)
  }
  return is_retryable
}

function get_dimensions() {
  try {
    let listings = SpreadsheetApp.openById('1RtMIDcOqTGUU76R7vv6YfN4k8Uxs0vqrlXsB1BYp7Ro').getSheetByName('Listings').getDataRange().getValues()
    let headers = listings.shift()

    let asins = [...new Set(listings.map((row) => row[headers.indexOf('asin1')]))].reduce((all, one, i) => {
      const per = 20
      const ch = Math.floor(i / per)
      all[ch] = [].concat(all[ch] || [], one)
      return all
    }, [])

    let catalog_items = {}
    asins.forEach((group, i) => {
      try {
        // console.log(group)
        let result = JSON.parse(get_amazon_catalog_items(group, i))
        // console.log(result)
        let items = result.items.reduce((all, one, i) => {
          all[one.asin] = { dimensions: one.dimensions[0].package }
          return all
        }, {})
        // console.log(JSON.stringify(items))
        catalog_items = { ...catalog_items, ...items }
      } catch (error) {
        console.error(`Error getting catalog items in get_dimensions: ${error}`)
      }
      Utilities.sleep(300)
    })
    return catalog_items
  } catch (error) {
    console.error(`Error in get_dimensions: ${error}`)
    return {}
  }
}

function format_procedure_quantity(value, max_quantity = 150) {
  return isNaN(value) ? null : Math.min(value, max_quantity)
}

// function get_sku_procedure() {
//   console.log(`Starting get_sku_procedure`)
//   return new Promise((resolve, reject) => {
//     try {
//       let sku_procedure_sheet = SpreadsheetApp.openById('1M6-4Ij4oYsGk0O1HfQ-Kx8azffJ36eDGmSwMO3Nsn6s')
//       let procedures = sku_procedure_sheet.getSheetByName('SKU Procedure').getDataRange().getValues()
//       let sku_avg = sku_procedure_sheet.getSheetByName('ARRAY - SKU AVG/BEST').getDataRange().getValues()

//       let headers = {
//         procedures: procedures.shift(),
//         sku_avg: sku_avg.shift(),
//       }

//       sku_avg = sku_avg.reduce((a, c) => {
//         a[c[headers.sku_avg.indexOf('SKU')]] = {
//           average: c[headers.sku_avg.indexOf('1 Year Average Units/Hour')],
//           best: c[headers.sku_avg.indexOf('1 Year Best Units/Hour')],
//         }
//         return a
//       }, {})

//       const data = procedures.reduce((a, c) => {
//         a[c[headers.procedures.indexOf('SKU')]] = {
//           optimized_ship_quantity: format_procedure_quantity(c[headers.procedures.indexOf('OPTIMIZED PER BOX QTY')]),
//           optimized_pallet_quantity: format_procedure_quantity(c[headers.procedures.indexOf('OPTIMIZED SHIP QTY')], 10000),
//           bundling: { ...(sku_avg[c[headers.procedures.indexOf('SKU')]] || { average: null, best: null }) },
//           shipping: {
//             default:
//               c[headers.procedures.indexOf('OPTIMIZED SHIP DIMENSIONS (max 25")')] !== ''
//                 ? {
//                     name: c[headers.procedures.indexOf('OPTIMIZED SHIP DIMENSIONS (max 25")')],
//                     dimensions: {
//                       width: Number.isNaN(parseFloat(c[headers.procedures.indexOf('WIDTH')]))
//                         ? 0
//                         : parseFloat(c[headers.procedures.indexOf('WIDTH')]),
//                       length: Number.isNaN(parseFloat(c[headers.procedures.indexOf('LENGTH')]))
//                         ? 0
//                         : parseFloat(c[headers.procedures.indexOf('LENGTH')]),
//                       height: Number.isNaN(parseFloat(c[headers.procedures.indexOf('HEIGHT')]))
//                         ? 0
//                         : parseFloat(c[headers.procedures.indexOf('HEIGHT')]),
//                       weight: Number.isNaN(parseFloat(c[headers.procedures.indexOf('WEIGHT')]))
//                         ? 0
//                         : parseFloat(c[headers.procedures.indexOf('WEIGHT')]),
//                     },
//                   }
//                 : {
//                     name: 'Custom',
//                     dimensions: { width: 0, length: 0, height: 0, weight: 1 },
//                   },
//           },
//         }
//         return a
//       }, {})
//       resolve(data)
//     } catch (error) {
//       console.error(`Error in get_sku_procedure: ${error}`)
//       reject(error)
//       // return {}
//     }
//   })
// }

function get_sku_procedure() {
  console.log(`Starting get_sku_procedure`)
  try {
    let sku_procedure_sheet = SpreadsheetApp.openById('1M6-4Ij4oYsGk0O1HfQ-Kx8azffJ36eDGmSwMO3Nsn6s')
    let procedures = sku_procedure_sheet.getSheetByName('SKU Procedure').getDataRange().getValues()
    let sku_avg = sku_procedure_sheet.getSheetByName('ARRAY - SKU AVG/BEST').getDataRange().getValues()

    let headers = {
      procedures: procedures.shift(),
      sku_avg: sku_avg.shift(),
    }

    sku_avg = sku_avg.reduce((a, c) => {
      a[c[headers.sku_avg.indexOf('SKU')]] = {
        average: c[headers.sku_avg.indexOf('1 Year Average Units/Hour')],
        best: c[headers.sku_avg.indexOf('1 Year Best Units/Hour')],
      }
      return a
    }, {})

    const data = procedures.reduce((a, c) => {
      a[c[headers.procedures.indexOf('SKU')]] = {
        optimized_ship_quantity: format_procedure_quantity(c[headers.procedures.indexOf('OPTIMIZED PER BOX QTY')]),
        optimized_pallet_quantity: format_procedure_quantity(c[headers.procedures.indexOf('OPTIMIZED SHIP QTY')], 10000),
        bundling: { ...(sku_avg[c[headers.procedures.indexOf('SKU')]] || { average: null, best: null }) },
        shipping: {
          default:
            c[headers.procedures.indexOf('OPTIMIZED SHIP DIMENSIONS (max 25")')] !== ''
              ? {
                  name: c[headers.procedures.indexOf('OPTIMIZED SHIP DIMENSIONS (max 25")')],
                  dimensions: {
                    width: Number.isNaN(parseFloat(c[headers.procedures.indexOf('WIDTH')])) ? 0 : parseFloat(c[headers.procedures.indexOf('WIDTH')]),
                    length: Number.isNaN(parseFloat(c[headers.procedures.indexOf('LENGTH')]))
                      ? 0
                      : parseFloat(c[headers.procedures.indexOf('LENGTH')]),
                    height: Number.isNaN(parseFloat(c[headers.procedures.indexOf('HEIGHT')]))
                      ? 0
                      : parseFloat(c[headers.procedures.indexOf('HEIGHT')]),
                    weight: Number.isNaN(parseFloat(c[headers.procedures.indexOf('WEIGHT')]))
                      ? 0
                      : parseFloat(c[headers.procedures.indexOf('WEIGHT')]),
                  },
                }
              : {
                  name: 'Custom',
                  dimensions: { width: 0, length: 0, height: 0, weight: 1 },
                },
        },
      }
      return a
    }, {})

    DriveApp.createFile('sku_procedure.json', JSON.stringify(data))

    return data
  } catch (error) {
    console.error(`Error in get_sku_procedure: ${error}`)
    return {}
  }
}

function get_kits() {
  console.log(`Starting get_kits`)
  return new Promise((resolve, reject) => {
    try {
      const response = SkuVault.API.Products.getKits()
      const data = JSON.parse(response).Kits
      resolve(data)
    } catch (error) {
      console.error(`Error in get_kits: ${error}`)
      reject(error)
      // return []
    }
  })
}

function format_kits(kits, products, map) {
  try {
    kits = kits.reduce((obj, kit) => {
      obj[kit.SKU] = Object.assign({
        components: kit.KitLines.map((component) =>
          Object.assign({
            required: component.Quantity,
            products: component.Items.map((product) => product.SKU),
          })
        ),
      })
      return obj
    }, {})

    kits = Object.keys(map).reduce((obj, product) => {
      if (kits[map[product]]) obj[product] = kits[map[product]]
      return obj
    }, {})

    products.forEach((product) => {
      if (!Object.keys(kits).includes(product.Sku) && product.IsAlternateSKU) {
        kits[product.Sku] = { components: [{ required: 1, products: [map[product.Sku]] }] }
      }
    })
    return kits
  } catch (error) {
    console.error(`Error in format_kits: ${error}`)
    return {}
  }
}

function get_products() {
  console.log(`Starting get_products`)
  return new Promise((resolve, reject) => {
    try {
      const response = SkuVault.API.Products.getProducts()
      const data = JSON.parse(response).Products
      resolve(data)
    } catch (error) {
      console.error(`Error in get_products: ${error}`)
      reject(error)
      // return []
    }
  })
}

// function format_products(products) {
//   try {
//     products = products.reduce((obj, product) => {
//       obj[product.Sku] = {
//         title: product.Description,
//         brand: product.Brand,
//         supplier: product.Supplier,
//         cost: product.Cost,
//         warehouse: {
//           inventory: {
//             onhand: product.IsAlternateSKU ? 0 : product.QuantityOnHand,
//             available: product.IsAlternateSKU ? 0 : product.QuantityAvailable,
//             incoming: product.IsAlternateSKU ? 0 : product.QuantityIncoming,
//           },
//         },
//         days_onhand: 0,
//       }
//       return obj
//     }, {})
//     return products
//   } catch (error) {
//     console.error(`Error in format_products: ${error}`)
//     return {}
//   }
// }

// function clean_products(products, sku_procedure, fba_inventory) {
//   try {
//     Object.keys(products).forEach((product) => {
//       products[product] = { ...products[product], ...sku_procedure[product] }
//       if (!Object.keys(fba_inventory).includes(product)) delete products[product]
//     })
//     Object.keys(fba_inventory).forEach((product) => {
//       if (!products[product])
//         products[product] = {
//           title: '',
//           cost: 0,
//           brand: '',
//           warehouse: { inventory: { onhand: 0, available: 0, incoming: 0 } },
//           amazon: fba_inventory[product],
//         }
//       else products[product].amazon = fba_inventory[product]
//     })
//     return Object.keys(products).reduce((a, product) => {
//       a.push(Object.assign({ sku: product }, products[product]))
//       return a
//     }, [])
//   } catch (error) {
//     console.error(`Error in clean_products: ${error}`)
//     return {}
//   }
// }

function format_products(products) {
  try {
    return products.map((product) => {
      return {
        sku: product.Sku,
        title: product.Description,
        brand: product.Brand,
        supplier: product.Supplier,
        cost: product.Cost,
        warehouse: {
          inventory: {
            onhand: product.IsAlternateSKU ? 0 : product.QuantityOnHand,
            available: product.IsAlternateSKU ? 0 : product.QuantityAvailable,
            incoming: product.IsAlternateSKU ? 0 : product.QuantityIncoming,
          },
        },
      }
    })
  } catch (error) {
    console.error(`Error in format_products: ${error}`)
    return {}
  }
}

function build_map(products) {
  try {
    let map = products.reduce((obj, product) => {
      if (!obj[product.Code] && !product.IsAlternateSKU) obj[product.Code] = product.Sku
      return obj
    }, {})

    map = products.reduce((obj, product) => {
      obj[product.Sku] = map[product.Code]
      return obj
    }, {})
    return map
  } catch (error) {
    console.error(`Error in build_map: ${error}`)
    return {}
  }
}

function get_components(kits, products) {
  try {
    let components = Object.values(kits).reduce((obj, kit) => {
      kit.components.forEach((component) => {
        component.products.forEach(
          (product) =>
            (obj[product] = {
              allocated: 0,
              available: products[product].warehouse.inventory.available,
              incoming: products[product].warehouse.inventory.incoming,
              supplier: products[product].supplier,
              cost: products[product].cost,
            })
        )
      })
      return obj
    }, {})

    Object.keys(products).forEach((product) => {
      if (!Object.keys(components).includes(product))
        components[product] = {
          allocated: 0,
          available: products[product].warehouse.inventory.available,
          incoming: products[product].warehouse.inventory.incoming,
          supplier: products[product].supplier,
          cost: products[product].cost,
        }
    })

    return components
  } catch (error) {
    console.error(`Error in get_components: ${error}`)
    return {}
  }
}

// async function compile_data() {
//   try {
//     // Get data from APIs and spreadsheets
//     console.time('Data Retrieval')
//     const [products, kits, fba_inventory, sku_procedure] = await Promise.all([get_products(), get_kits(), get_fba_inventory(), get_sku_procedure()])
//     console.timeEnd('Data Retrieval')

//     // Transform data
//     console.time('Data Transformation')
//     let map = build_map(products) // Build an 'Alternate SKU' map of the 'Products'
//     let formatted_kits = format_kits(kits, products, map) // Format the 'Kits' array into an object
//     let formatted_products = format_products(products) // Format the 'Products' array into an object
//     let components = get_components(formatted_kits, formatted_products) // Build a 'Components' object that contains all fo the 'Products' in every 'Kit'
//     let cleaned_products = clean_products(formatted_products, sku_procedure, fba_inventory) // Combine the 'Products' and 'SKU Procedure' objects and remove all 'Products' that do not have 'FBA Inventory'
//     console.timeEnd(`Data Transformation`)

//     return {
//       products: cleaned_products,
//       kits: formatted_kits,
//       components,
//     }
//   } catch (error) {
//     console.error(`Error in compile_data: ${error}`)
//     return {}
//   }
// }

async function get_products_and_kits() {
  try {
    // Get data from APIs and spreadsheets
    console.time('Data Retrieval')
    const [products, kits] = await Promise.all([get_products(), get_kits()])
    console.timeEnd('Data Retrieval')

    // Transform data
    console.time('Data Transformation')
    let map = build_map(products) // Build an 'Alternate SKU' map of the 'Products'
    let formatted_kits = format_kits(kits, products, map) // Format the 'Kits' array into an object
    let formatted_products = format_products(products) // Format the 'Products' array into an object
    console.timeEnd(`Data Transformation`)

    const compiledData = {
      products: formatted_products,
      kits: formatted_kits,
    }

    DriveApp.createFile('products_and_kits.json', JSON.stringify(compiledData))

    return compiledData
  } catch (error) {
    console.error(`Error in get_products_and_kits: ${error}`)
    return {}
  }
}

function set_dropship_sku(product) {
  try {
    let skus = JSON.parse(PropertiesService.getScriptProperties().getProperty('dropship_skus')) || []
    !skus.includes(product) ? skus.push(product) : skus.splice(skus.indexOf(product), 1)
    PropertiesService.getScriptProperties().setProperty('dropship_skus', JSON.stringify(skus))
    return skus
  } catch (error) {
    console.error(`Error in set_dropship_sku: ${error}`)
    return []
  }
}

function get_skuvault_warehouses() {
  try {
    let warehouses = JSON.parse(SkuVault.API.Inventory.getWarehouses()).Warehouses
    warehouses.sort((a, b) => (a.Code > b.Code ? 1 : -1))
    return warehouses
  } catch (error) {
    console.error(`Error in get_skuvault_warehouses: ${error}`)
    return []
  }
}
