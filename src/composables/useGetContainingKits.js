export const useGetContainingKits = (searchTerm, kits) => {
  // Get all kits that contain a component matching the search input
  return Object.keys(kits).filter((kit) =>
    kits[kit].components.find((component) => component.products.find((product) => product.match(new RegExp(searchTerm, 'i'))))
  )
}
