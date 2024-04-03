function compile_draft_purchase_orders(data) {
  console.log(data)
  const skuvault = {
    warehouse_id: 'P7HQ',
    ship_to_address: 'P7HQ',
  }

  try {
    data = data.reduce((arr, product, i) => {
      const record = arr.find((r) => r.SupplierName === product.supplier)
      if (record) {
        record.LineItems.push({ SKU: product.sku, Quantity: product.allocated })
        record.LineItems.sort((a, b) => (a.SKU > b.SKU ? 1 : -1))
      } else {
        arr.push({
          SupplierName: product.supplier,
          PoNumber: `DRAFT_${Utilities.getUuid()}`,
          LineItems: [{ SKU: product.sku, Quantity: product.allocated }],
          ShipToWarehouse: skuvault.warehouse_id,
        })
      }
      return arr
    }, [])
    data.sort((a, b) => (a.SupplierName > b.SupplierName ? 1 : -1))
    return data
  } catch (error) {
    console.error(error)
  }
}

// function create_purchase_orders(data) {
//   const interval = 6;

//   let notification = {
//     type: 'is-success',
//     message: 'Purchase Orders were successfully created.',
//   };

//   for (const [index, order] of data.entries()) {
//     console.log(`Creating PO# ${index + 1} (Supplier: ${order.SupplierName}, Line Items: ${order.LineItems.map((item) => item.SKU).join(', ')})`);
//     const status = create_purchase_order(order);
//     if (status !== 'Success') {
//       let message = `There was a problem with PO# ${index + 1}: ${status}`;
//       console.log(message);
//       notification.type = 'is-danger';
//       notification.message = message;
//       break;
//     }
//     if (index < data.length - 1) Utilities.sleep(interval * 1000);
//   }
//   return notification;
// }

function export_purchase_order(order) {
  // let filename = `DRAFT_PO_${Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_hh-mm-ss')}`
  let po_number = order.PoNumber === '' ? Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_hh-mm-ss') : order.PoNumber
  let filename = `DRAFT_PO_${po_number}`
  let file_headers = ['SupplierName', 'ShipToWarehouse']
  let product_headers = ['SKU', 'Quantity']
  let headers = `${file_headers.map((header) => `${header}\t${order[header]}`).join(`\n`)}\n\n${product_headers.join(`\t`)}`
  let products = order.LineItems.map((product) => `${product.SKU}\t${product.Quantity}`).join(`\n`)
  let file = `${headers}\n${products}`
  file = Utilities.newBlob(file, 'tsv', `${filename}.tsv`)
  return { bytes: file.getBytes(), filename: file.getName() }
}

function create_purchase_order(order) {
  console.log(order)
  // let sequence = get_script_property('purchase_order').current || 1

  try {
    // order.PoNumber = `DRAFT_${sequence.toString().padStart(5, 0)}`
    if (order.PoNumber === '') delete order.PoNumber

    let request = SkuVault.API.PurchaseOrders.createPO(order)
    const { CreatePOStatus, PoNumber } = JSON.parse(request)
    if (CreatePOStatus !== 'Success') throw new Error(CreatePOStatus)
    // set_script_property({ property: 'purchase_order', value: { current: sequence + 1 } })

    order.notification = {
      type: 'is-success',
      message: `PO# ${PoNumber} has been created`,
    }
  } catch (e) {
    order.notification = {
      type: 'is-danger',
      message: `There was a problem. ${e}`,
    }
  }

  return order
}

function rename_purchase_order(PoNumber) {
  PoNumber = 'PL7-1944'
  const draftPoNumber = `DRAFT_${PoNumber}`
  let request = SkuVault.API.PurchaseOrders.getPOs({ PONumbers: [PoNumber] })
  const { PoId: PurchaseOrderId } = JSON.parse(request).PurchaseOrders[0]

  // return console.log(PoId)

  request = SkuVault.API.PurchaseOrders.updatePOs({ POs: [{ PurchaseOrderId: parseInt(PurchaseOrderId), PoNumber: draftPoNumber }] })

  console.log(JSON.stringify(JSON.parse(request), null, 2))
}
