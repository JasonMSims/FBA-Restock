// @index(['./*/index.js'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './data'
export * from './elements'
export * from './forms'
export * from './layout'
export * from './navigation'
export * from './overlays'
// @endindex

// @index('./*.{js,vue}', f => `export { default as ${f.name} } from '${f.path}${f.ext}'`)
export { default as ComponentsTable } from './ComponentsTable.vue'
export { default as ProductsTable } from './ProductsTable.vue'
export { default as RestockProducts } from './RestockProducts.vue'
// @endindex
