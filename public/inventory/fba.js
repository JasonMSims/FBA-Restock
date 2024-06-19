function create_fba(products) {
  // const marketplace= 'US';
  products = products.map((product) =>
    Object.assign({ sku: product.sku, quantity: product.replenishment.quantity, qpc: product.replenishment.quantity_per_case })
  )
  let plan = create_fba_plan(products, { marketplace: marketplace.code })
  return { bytes: plan.getBytes(), filename: plan.getName() }
}

function create_individual_fbas(products) {
  const timestamp = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_hh-mm-ss')
  // const marketplace= 'US';

  let plans = products.map((product, i) => {
    return create_fba_plan([{ sku: product.sku, quantity: product.replenishment.quantity, qpc: product.replenishment.quantity_per_case }], {
      marketplace: marketplace.code,
      filename: `${timestamp}_${product.sku}`,
    })
  })

  let zip = Utilities.zip(plans, `FBA_${marketplace.code}_${timestamp}.zip`)
  return { bytes: zip.getBytes(), filename: zip.getName() }
}

function create_fba_plan(products, params) {
  let marketplace = params.marketplace || 'US'
  let filename = params.filename || `FBA_${marketplace}_${Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_hh-mm-ss')}`
  let file_headers = {
    PlanName: filename,
    ShipToCountry: marketplace,
    AddressName: 'P7HQ',
    AddressFieldOne: '955 Patrick Industrial Ct',
    AddressFieldTwo: '',
    AddressCity: 'Winder',
    AddressCountryCode: 'US',
    AddressStateOrRegion: 'GA',
    AddressPostalCode: '30680',
  }
  let sku_headers = ['MerchantSKU', 'UnitsPerCase', 'NumberOfCases', 'Quantity']
  let headers = `${Object.keys(file_headers)
    .map((header) => `${header}\t${file_headers[header]}`)
    .join('\n')}\n\n${sku_headers.join('\t')}`
  let skus = products.map((product) => `${product.sku}\t${product.qpc}\t${Math.ceil(product.quantity / product.qpc)}\t${product.quantity}`).join('\n')

  let file = `${headers}\n${skus}`
  return Utilities.newBlob(file, 'tsv', `${filename}.tsv`)
}

function create_sta_workflow(products) {
  const filename = `STA_${Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_hh-mm-ss')}`
  // console.log(filename)
  // console.log(JSON.stringify(products, null, 2))
  const file_headers = {
    prep_owner: { title: 'Default prep owner', value: 'Seller' },
    labeling_owner: { title: 'Default labeling owner', value: 'Seller' },
  }
  const sku_headers = [
    'Merchant SKU',
    'Quantity',
    'Prep owner',
    'Labeling owner',
    'Units per box',
    'Number of boxes',
    'Box length (in)',
    'Box width (in)',
    'Box height (in)',
    'Box weight (lb)',
  ] // Case pack
  // const sku_headers = ['Merchant SKU', 'Quantity', 'Prep owner', 'Labeling owner'] // Individual
  const headers = `${filename}\n\n${Object.values(file_headers)
    .map((header) => `${header.title}\t${header.value}`)
    .join('\n')}\n\n${sku_headers.join('\t')}`
  const skus = products
    .map((product) => {
      console.log(product.amazon)
      let row = [
        product.sku,
        product.replenishment.quantity,
        '',
        '',
        product.replenishment.quantity_per_case,
        Math.ceil(product.replenishment.quantity / product.replenishment.quantity_per_case),
        product.shipping.current.dimensions.length,
        product.shipping.current.dimensions.width,
        product.shipping.current.dimensions.height,
        product.amazon.dimensions?.weight.unit === 'pounds'
          ? Math.ceil(product.amazon.dimensions?.weight.value * product.replenishment.quantity_per_case + product.shipping.current.dimensions.weight)
          : 'ERROR',
      ]
      return row.join('\t')
    }) // Case pack
    // .map((product) => `${product.sku}\t${product.replenishment.quantity}`) // Individual
    .join('\n')

  let file = `${headers}\n${skus}`
  file = Utilities.newBlob(file, 'tsv', `${filename}.txt`)
  return { bytes: file.getBytes(), filename: file.getName() }
}
