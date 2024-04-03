const tst = () => {
  console.time(`Get Orders from Sheet...`)
  console.log(Object.keys(get_fba_orders()).length)
  console.timeEnd(`Get Orders from Sheet...`)
  console.time(`Get Orders from DB...`)
  console.log(Object.keys(get_fba_orders_db()).length)
  console.timeEnd(`Get Orders from DB...`)
}
function get_fba_orders_db(options) {
  const conn = new DB()

  let end_date = (function (d) {
    d.setDate(d.getDate() - 1)
    return d
  })(new Date())
  end_date.setHours(23, 59, 59, 999)
  let start_date_month = new Date(end_date)
  start_date_month.setHours(29 * -24, 0, 0, 0)
  let start_date_week = new Date(end_date)
  start_date_week.setHours(6 * -24, 0, 0, 0)
  let start_date_day = new Date(end_date)
  start_date_day.setHours(0 * -24, 0, 0, 0)

  let query = `
  SELECT 30d.product, IFNULL(7d.quantity,0) AS 7d, IFNULL(30d.quantity,0) AS 30d FROM
(
  SELECT sku AS product, sum(quantity) AS quantity FROM amazon_orders WHERE (purchase_date BETWEEN CONVERT_TZ('${Utilities.formatDate(
    new Date(start_date_month),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND CONVERT_TZ('${Utilities.formatDate(
    new Date(end_date),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND sales_channel = 'Amazon.com' AND order_status != 'Cancelled' AND item_status != 'Cancelled') GROUP BY product
  UNION
  SELECT asin AS product, sum(quantity) AS quantity FROM amazon_orders WHERE (purchase_date BETWEEN CONVERT_TZ('${Utilities.formatDate(
    new Date(start_date_month),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND CONVERT_TZ('${Utilities.formatDate(
    new Date(end_date),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND sales_channel = 'Amazon.com' AND order_status != 'Cancelled' AND item_status != 'Cancelled') GROUP BY product
) AS 30d
LEFT JOIN
(
  SELECT sku AS product, sum(quantity) AS quantity FROM amazon_orders WHERE (purchase_date BETWEEN CONVERT_TZ('${Utilities.formatDate(
    new Date(start_date_week),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND CONVERT_TZ('${Utilities.formatDate(
    new Date(end_date),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND sales_channel = 'Amazon.com' AND order_status != 'Cancelled' AND item_status != 'Cancelled') GROUP BY  product
  UNION
  SELECT asin AS product, sum(quantity) AS quantity FROM amazon_orders WHERE (purchase_date BETWEEN CONVERT_TZ('${Utilities.formatDate(
    new Date(start_date_week),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND CONVERT_TZ('${Utilities.formatDate(
    new Date(end_date),
    'America/Los_Angeles',
    'yyyy-MM-dd HH:mm:ss.SSS'
  )}','America/Los_Angeles','UTC') AND sales_channel = 'Amazon.com' AND order_status != 'Cancelled' AND item_status != 'Cancelled') GROUP BY  product
) AS 7d
ON 30d.product = 7d.product
;
  `

  const stmnt = conn.createStatement()
  const rs = stmnt.executeQuery(query)

  let orders = {}

  while (rs.next()) {
    // for (let i = 0; i < rs.getMetaData().getColumnCount(); i++) {
    //   console.log(rs.getMetaData().getColumnLabel(i + 1))
    // }
    if (!orders[rs.getString(1)]) orders[rs.getString(1)] = { units_sold: {} }
    orders[rs.getString(1)].units_sold[rs.getMetaData().getColumnLabel(2)] = rs.getString(2)
    orders[rs.getString(1)].units_sold[rs.getMetaData().getColumnLabel(3)] = rs.getString(3)
  }

  rs.close()
  stmnt.close()
  conn.close()
  return orders
}
