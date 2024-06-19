import { onMounted, onUnmounted, ref } from 'vue'

export const useWindowResize = (callback) => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    callback(width.value, height.value) // Call the callback with updated dimensions
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // Call once initially to set initial values
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { height, width }
}
