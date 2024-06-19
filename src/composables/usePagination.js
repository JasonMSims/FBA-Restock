import { computed, isRef, ref } from 'vue'

export const usePagination = ({ pageSize = 35, arrayToPaginate, currentPage }) => {
  pageSize = isRef(pageSize) ? pageSize : ref(pageSize)
  arrayToPaginate = isRef(arrayToPaginate) ? arrayToPaginate : ref(arrayToPaginate)
  currentPage = isRef(currentPage) ? currentPage : ref(currentPage)

  const paginatedArray = computed(() =>
    arrayToPaginate.value.filter((row, index) => index >= (currentPage.value - 1) * pageSize.value && index < currentPage.value * pageSize.value)
  )

  const numberOfPages = computed(() => Math.ceil((arrayToPaginate.value.length || 0) / pageSize.value))

  return {
    paginatedArray,
    numberOfPages,
    pageSize,
  }
}
