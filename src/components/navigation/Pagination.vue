<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="flex items-end justify-between border-t border-slate-200 px-4 pb-4 dark:border-slate-800">
    <div class="hidden sm:block" v-if="numberOfRows && pageSize">
      <p class="not-prose text-sm">
        Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to
        <span class="font-medium">{{ Math.min(currentPage * pageSize, numberOfRows) }}</span> of <span class="font-medium"> {{ numberOfRows }} </span
        ><span v-if="label">{{ ' ' }}{{ label }}</span>
      </p>
    </div>
    <div class="-mt-px flex flex-1 items-center justify-between gap-4 sm:justify-end">
      <button
        :disabled="currentPage <= 1"
        @click="previous"
        class="group inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium transition-all hover:border-slate-300 disabled:border-transparent disabled:text-slate-300 dark:hover:text-white dark:disabled:text-slate-400"
      >
        <ArrowLongLeftIcon
          aria-hidden="true"
          class="mr-3 h-5 w-5 transition-all group-hover:text-indigo-600 group-disabled:text-inherit dark:group-hover:text-indigo-400 dark:group-disabled:text-inherit"
        />
        <span>Previous</span>
      </button>

      <div class="hidden md:-mt-px md:flex" v-if="showPages">
        <template :key="index" v-for="(page, index) in pages">
          <span class="inline-flex items-center border-t-2 border-transparent px-2 pt-4 text-sm font-medium" v-if="isNaN(page)">...</span>
          <a
            :class="[
              'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium no-underline',
              currentPage === page
                ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent transition-colors hover:border-slate-300 dark:hover:text-white',
            ]"
            @click="setCurrentPage(page)"
            href="#"
            v-else
          >
            {{ page }}
          </a>
        </template>
      </div>
      <button
        :disabled="currentPage >= numberOfPages || !numberOfPages"
        @click="next"
        class="group inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium transition-all hover:border-slate-300 disabled:border-transparent disabled:text-slate-400 dark:hover:text-white"
      >
        <span>Next</span>
        <ArrowLongRightIcon
          aria-hidden="true"
          class="ml-3 h-5 w-5 transition-all group-hover:text-indigo-600 group-disabled:text-inherit dark:group-hover:text-indigo-400 dark:group-disabled:text-inherit"
        />
      </button>
    </div>
  </nav>
</template>
<script setup>
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/solid'
import { computed, toRefs } from 'vue'

const props = defineProps({
  label: { type: String },
  modelValue: {
    required: true,
    type: Number,
  },
  numberOfPages: { required: true, type: Number },
  numberOfRows: { type: Number },
  pageSize: { type: Number },
  showPages: { type: Boolean },
})

const { modelValue: currentPage, numberOfPages, numberOfRows, pageSize, showPages } = toRefs(props)

const getRange = (start, end) => [...Array(end - start + 1).keys()].map((v, i) => i + start)

const generatePageRange = (currentPage, pageCount) => {
  let delta = pageCount <= 7 ? 7 : currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4

  const range = {
    end: Math.round(currentPage + delta / 2),
    start: Math.round(currentPage - delta / 2),
  }

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1
    range.end += 1
  }

  let pages =
    currentPage > delta
      ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1))

  const withDots = (value, pair) => (pages.length + 1 !== pageCount ? pair : [value])

  if (pages[0] !== 1) {
    pages = [...withDots(1, [1, '...']), ...pages]
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = [...pages, ...withDots(pageCount, ['...', pageCount])]
  }

  return pages
}

const pages = computed(() => generatePageRange(currentPage.value, numberOfPages.value, 1))

const emit = defineEmits(['update:modelValue'])

const setCurrentPage = (number) => {
  emit('update:modelValue', number)
}

const previous = () => {
  if (currentPage.value === 1) return
  emit('update:modelValue', currentPage.value - 1)
}

const next = () => {
  if (currentPage.value >= numberOfPages.value) return
  emit('update:modelValue', currentPage.value + 1)
}
</script>
