<template>
  <b-dropdown :mobile-modal="false" :triggers="['hover']" custom>
    <template #trigger="{}">
      <notebook-text-icon
        :class="['h-5 w-5', skuNotes && skuNotes.length > 0 ? ' fill-amber-100 text-amber-400' : 'fill-none text-amber-300']"
        :stroke-width="1.5"
      />
    </template>
    <div class="relative">
      <div class="note__content inline-flex max-w-lg flex-wrap items-center p-8 transition">
        <div class="w-full text-gray-900" v-if="skuNotes && skuNotes.length > 0">
          <div
            :key="noteIndex"
            class="note__item -mx-8 flex items-center justify-between px-8 py-2 hover:bg-gray-100"
            v-for="(note, noteIndex) of skuNotes"
          >
            <span>
              <div class="whitespace-normal">{{ note.note }}</div>
              <time :datetime="note.timestamp" class="text-sm text-gray-700">{{
                DateTime.fromISO(note.timestamp).toLocaleString(DateTime.DATETIME_MED)
              }}</time>
            </span>
            <trash-2-icon
              :stroke-width="1.5"
              @click="deleteNote(sku, noteIndex)"
              class="ml-2 h-5 w-5 shrink-0 cursor-pointer opacity-50 transition hover:opacity-100"
            />
          </div>
        </div>
        <div class="w-full space-y-2 text-gray-900" v-if="displayNoteInput.sku === sku">
          <div class="note__item flex flex-grow items-center justify-between">
            <input class="flex-grow rounded border border-gray-200 p-2" type="text" v-model="displayNoteInput.note" />
            <span class="flex items-center" v-if="!skuNotesLoading">
              <check-icon
                :stroke-width="1.5"
                @click="addNote(sku, displayNoteInput.note)"
                class="ml-2 h-5 w-5 shrink-0 cursor-pointer text-gray-500 transition hover:text-green-600"
              />
              <x-icon
                :stroke-width="1.5"
                @click="clearNoteInput"
                class="ml-2 h-5 w-5 shrink-0 cursor-pointer text-gray-500 transition hover:text-rose-600"
              />
            </span>
          </div>
        </div>
        <p class="text-sm text-gray-500" v-if="(!skuNotes || skuNotes.length === 0) && displayNoteInput.sku !== sku">
          There are no notes for {{ sku }}.
        </p>
      </div>
      <div class="border-t border-gray-200 px-8 py-4">
        <b-button :class="['ml-2']" @click="displayNoteInput.sku = sku" type="is-warning is-light"
          ><span :class="['flex items-center']"><plus-icon :class="['h-5 w-5 text-amber-700']" :stroke-width="1.5" />Add a Note</span></b-button
        >
      </div>
      <b-loading :can-cancel="false" :is-full-page="false" v-model="skuNotesLoading"></b-loading>
    </div>
  </b-dropdown>
</template>
<script setup>
import { useNoteStore } from '@/stores'
import { CheckIcon, NotebookTextIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = defineProps({
  sku: String,
})
const noteStore = useNoteStore()
const { skuNotesLoading } = storeToRefs(noteStore)
const { getNotesBySku } = noteStore

const displayNoteInput = ref({
  note: '',
  sku: '',
})

const skuNotes = computed(() => getNotesBySku(props.sku))

const addNote = (sku, note) => {
  clearNoteInput() // Clear the Note text input field
  const noteStore = useNoteStore()
  noteStore.addSkuNote(sku, { note, timestamp: new Date().toISOString() })
}
const clearNoteInput = () => {
  // Clear the Note text input field
  displayNoteInput.value = { note: '', sku: '' }
}
const deleteNote = (sku, noteIndex) => {
  const noteStore = useNoteStore()
  noteStore.deleteSkuNote(sku, noteIndex)
}
</script>
<style lang="scss">
.note__content {
  min-width: 24rem;
  max-height: 24rem;
  overflow: scroll;
}
</style>
