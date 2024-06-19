import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { noteService } from '@/js/services'

export const useNoteStore = defineStore('note', () => {
  const skuNotes = ref({})
  const loading = ref(false)

  const skusWithNotes = computed(() => {
    return Object.keys(skuNotes.value).filter((sku) => skuNotes.value[sku].length > 0)
  })

  async function fetchSkuNotes() {
    try {
      loading.value = true
      skuNotes.value = await noteService.fetchSkuNotes()
    } catch (error) {
      console.error(`Failed to fetch SKU notes:`, error)
    } finally {
      loading.value = false
    }
  }

  function getNotesBySku(sku) {
    return skuNotes.value[sku] || []
  }

  async function addSkuNote(sku, note) {
    try {
      loading.value = true
      if (!skuNotes.value[sku]) {
        skuNotes.value[sku] = []
      }
      skuNotes.value[sku].push(note)
      await noteService.updateSkuNotes(skuNotes.value, true)
    } catch (error) {
      console.error(`There was an error adding the SKU note:`, error)
    } finally {
      loading.value = false
    }
  }

  async function deleteSkuNote(sku, noteIndex) {
    try {
      loading.value = true
      skuNotes.value[sku].splice(noteIndex, 1)
      await noteService.updateSkuNotes(skuNotes.value, false)
    } catch (error) {
      console.error(`There was an error deleting the SKU note:`, error)
    } finally {
      loading.value = false
    }
  }

  // Fetch SKU Notes as soon as the Store is initialized
  fetchSkuNotes()

  return { skuNotes, skusWithNotes, skuNotesLoading: loading, getNotesBySku, addSkuNote, deleteSkuNote }
})
