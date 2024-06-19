// const merge = (t, s) => {
//   const o = Object,
//     a = o.assign;
//   for (const k of o.keys(s)) s[k] instanceof o && a(s[k], merge(t[k], s[k]));
//   return a(t || {}, s), t;
// };

function property_cache(property, callback) {
  let data = {}
  let stored_property = PropertiesService.getScriptProperties().getProperty(property)
  if (!stored_property || cache_expired(JSON.parse(stored_property).timestamp)) {
    data = callback()
    PropertiesService.getScriptProperties().setProperty(property, JSON.stringify({ data: data, timestamp: new Date().toISOString() }))
  } else {
    data = JSON.parse(stored_property).data
  }
  return data
}

function cache_expired(timestamp, seconds) {
  seconds = seconds || 30
  return new Date().getTime() - new Date(timestamp).getTime() > 1000 * seconds ? true : false
}

function set_property(params, property_type, merge = true) {
  try {
    let type = Array.isArray(params.value) ? 'array' : typeof params.value
    let service = property_type === 'script' ? PropertiesService.getScriptProperties() : PropertiesService.getUserProperties()

    if (type === 'array') {
      service.setProperty(params.property, JSON.stringify(params.value))
    } else {
      let property = JSON.parse(service.getProperty(params.property)) || {}
      if (type === 'object') {
        property = _.merge(merge ? property : {}, params.value)
      } else {
        // 'number' or 'string'
        property = params.value
      }
      service.setProperty(params.property, JSON.stringify(property))
    }

    console.log(`Successfully set ${property_type} property: `, params.property)
    return params.value // Return the value that was set
  } catch (error) {
    console.error(`There was an error in set_property: ${error}`)
  }
}

function set_script_property(params, merge = true) {
  return set_property(params, 'script', merge)
}

function replace_script_property(params) {
  PropertiesService.getScriptProperties().setProperty(params.property, JSON.stringify(params.value))
  return params.value
}

function set_user_property(params, merge = true) {
  const property = set_property(params, 'user', merge)
  // console.log(property)
  return property
}

function get_script_property(propertyName) {
  console.log(`Getting ${JSON.stringify(propertyName, null, 2)} (script_property)`)
  let property = JSON.parse(PropertiesService.getScriptProperties().getProperty(propertyName))
  console.log(property)
  return property
}

// function get_script_properties() {
//   let properties = PropertiesService.getScriptProperties().getProperties()
//   console.log(JSON.stringify(properties, null, 2))
// }

function get_script_properties(propertyNames) {
  let scriptProperties = PropertiesService.getScriptProperties()
  let properties = {}
  propertyNames.forEach((name) => {
    let property = scriptProperties.getProperty(name)
    if (property) {
      properties[name] = JSON.parse(property)
    }
  })
  return properties
}

function get_user_property(property) {
  property = JSON.parse(PropertiesService.getUserProperties().getProperty(property))
  return property
}

function get_user_properties() {
  let properties = PropertiesService.getUserProperties().getProperties()
  console.log(JSON.stringify(properties, null, 2))
}

const get_user_preferences = () => {
  const user_preferences = JSON.parse(PropertiesService.getUserProperties().getProperty('user_preferences')) || {}
  console.log(user_preferences)
}

const clear_user_preferences = () => {
  PropertiesService.getUserProperties().deleteProperty('user_preferences')
}

function clear_user_properties() {
  PropertiesService.getUserProperties().deleteAllProperties()
}

function clear_script_properties() {
  // PropertiesService.getScriptProperties().deleteProperty('kits');
  // PropertiesService.getScriptProperties().deleteProperty('products');
  PropertiesService.getScriptProperties().deleteProperty('shipping_boxes')
}

function tst_user_pref() {
  set_user_property({ property: 'user_preferences', value: { filters: { sku: { input: 'ALR', value: 'ALR', loading: false } } } })
  get_user_properties()
}

function check_prop() {
  PropertiesService.getScriptProperties().deleteProperty('favorite_skus')
  // set_script_property({ property: 'purchase_order', value: { current: 1 } })
  // console.log(get_script_property('purchase_order'))
}

function fix_prop() {
  let favorite_skus = [
    'EML-2XE0053GB',
    'KRT-250-2XGHB',
    'MAD-47578-BAG',
    'LSB-10XEBOS05',
    'LSB-4XEBOS05',
    'LSB-2XEBOS05',
    'LSB-BCGJ02',
    'HSL-SP100-2XSAPK30-SPST-EBOOK',
    'CLP-2X60002-2X60039',
    'CLP-4X60044',
    'NTC-2XNT326E-SPR22-AQU',
    'MAD-K48585-RED',
    'NUV-CGA540-OZONESTETH',
    'LSB-EBOS120',
    'PIO-BDRXD07UHD-CASE',
    'PIO-BDRXD07B-CASE',
    'LPI-PINKPOUCH-S',
    'CCL-SPURTLE-4PC',
    'ECW-2200',
    'ECW-2200-EBOOK',
  ]

  set_script_property({ property: 'favorite_skus', value: favorite_skus }, false)
}

function backup_script_properties() {
  let properties = PropertiesService.getScriptProperties().getProperties()
  properties = Object.keys(properties).reduce((a, c) => {
    a[c] = JSON.parse(properties[c])
    return a
  }, {})
  // return console.log(properties)
  const folder = DriveApp.getFolderById('10LPDV9u4MVGlHFR3I7V02_hWGy2Luhau')
  folder.createFile(
    `${Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd_HH-mm-ss')}.json`,
    JSON.stringify(properties),
    'application/json'
  )
}
