export const toCamelCase = (str) => {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
}

export const migrateKeys = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = toCamelCase(key)
    acc[newKey] = migrateKeys(value)
    return acc
  }, {})
}
