<template>
  <b-dropdown custom :mobile-modal="false" :triggers="['hover']">
    <!-- <b-dropdown custom :mobile-modal="false"> -->
    <template #trigger="{ active }">
      <!-- <b-icon class="note__icon relative" :pack="skuNotes && skuNotes.length > 0 ? 'fas' : 'far'" icon="sticky-note" type="is-warning"></b-icon> -->
      <component :is="skuNotes && skuNotes.length > 0 ? NoteSolid : NoteOutline" :class="['w-5 h-5 text-yellow-300']" />
    </template>
    <div class="relative">
      <div class="note__content inline-flex max-w-lg flex-wrap items-center p-8 transition">
        <div v-if="skuNotes && skuNotes.length > 0" class="w-full text-gray-900">
          <div v-for="(note, noteIndex) of skuNotes" class="note__item -mx-8 flex items-center justify-between px-8 py-2 hover:bg-gray-100">
            <span>
              <div class="whitespace-normal">{{ note.note }}</div>
              <time :datetime="note.timestamp" class="text-sm text-gray-700">{{
                DateTime.fromISO(note.timestamp).toLocaleString(DateTime.DATETIME_MED)
              }}</time>
            </span>
            <b-icon
              @click.native="deleteNote(sku, noteIndex)"
              pack="far"
              icon="trash-alt"
              size="is-small"
              class="ml-2 cursor-pointer opacity-50 transition hover:opacity-100"
            ></b-icon>
          </div>
        </div>
        <div v-if="displayNoteInput.sku === sku" class="w-full space-y-2 text-gray-900">
          <div class="note__item flex flex-grow items-center justify-between">
            <input type="text" v-model="displayNoteInput.note" class="flex-grow rounded border border-gray-200 p-2" />
            <span v-if="!skuNotesLoading">
              <b-icon
                @click.native="addNote(sku, displayNoteInput.note)"
                pack="fas"
                icon="check"
                size="is-small"
                class="ml-2 cursor-pointer opacity-50 transition hover:opacity-100"
              ></b-icon>
              <b-icon
                @click.native="clearNoteInput"
                pack="fas"
                icon="times"
                size="is-small"
                class="ml-2 cursor-pointer opacity-50 transition hover:opacity-100"
              ></b-icon>
            </span>
          </div>
        </div>
        <p v-if="(!skuNotes || skuNotes.length === 0) && displayNoteInput.sku !== sku" class="text-sm text-gray-500">
          There are no notes for {{ sku }}.
        </p>
      </div>
      <div class="border-t border-gray-200 px-8 py-4">
        <!-- <b-button @click.native="displayNoteInput.sku = sku" class="ml-2" type="is-warning is-light">
          <b-icon pack="fas" icon="plus" class="mr-1"></b-icon>Add a Note</b-button> -->
        <b-button @click.native="displayNoteInput.sku = sku" :class="['ml-2']" type="is-warning is-light"
          ><span :class="['flex items-center']"><plus-icon :class="['w-5 h-5 text-yellow-700']" />Add a Note</span></b-button
        >
      </div>
      <b-loading :is-full-page="false" v-model="skuNotesLoading" :can-cancel="false"></b-loading>
    </div>
  </b-dropdown>
</template>
<script setup>
import { ref, computed } from 'vue'
import { _ } from 'lodash'
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'
import { useNoteStore } from '@/stores'
import { ChatBubbleBottomCenterTextIcon as NoteOutline, PlusIcon } from '@heroicons/vue/24/outline'
import { ChatBubbleBottomCenterTextIcon as NoteSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  sku: String,
})
const noteStore = useNoteStore()
const { skuNotesLoading } = storeToRefs(noteStore)
const { getNotesBySku } = noteStore

const displayNoteInput = ref({
  sku: '',
  note: '',
})

const skuNotes = computed(() => getNotesBySku(props.sku))

const addNote = (sku, note) => {
  clearNoteInput() // Clear the Note text input field
  const noteStore = useNoteStore()
  noteStore.addSkuNote(sku, { timestamp: new Date().toISOString(), note })
}
const clearNoteInput = () => {
  // Clear the Note text input field
  displayNoteInput.value = { sku: '', note: '' }
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
