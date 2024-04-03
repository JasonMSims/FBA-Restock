<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <HPopover>
    <Float
      :arrow="arrow"
      :flip="flip"
      :offset="offset"
      :placement="placement"
      :shift="shift"
      :z-index="zIndex"
      enter="transition duration-100 ease-out"
      enter-from="transform scale-95 opacity-0"
      enter-to="transform scale-100 opacity-100"
      leave="transition duration-75 ease-in"
      leave-from="transform scale-100 opacity-100"
      leave-to="transform scale-95 opacity-0"
      reference-hidden-class="invisible"
      transform
    >
      <HPopoverButton class="rounded outline-none ring-1 ring-inset ring-slate-300 dark:ring-slate-500">
        <slot name="trigger"> Open </slot>
      </HPopoverButton>

      <HPopoverPanel
        :static="mode === 'hover'"
        class="rounded-lg border border-slate-200 bg-white shadow-md focus:outline-none dark:border-slate-500 dark:bg-slate-800"
      >
        <FloatArrow
          class="absolute h-5 w-5 rotate-45 rounded-sm border border-slate-200 bg-white dark:border-slate-500 dark:bg-slate-800"
          v-if="arrow"
        />
        <div class="relative h-full rounded-md">
          <slot name="panel">
            <!-- placeholder div for the panel -->
          </slot>
        </div>
      </HPopoverPanel>
    </Float>
  </HPopover>
</template>

<script setup>
import { Popover as HPopover, PopoverButton as HPopoverButton, PopoverPanel as HPopoverPanel } from '@headlessui/vue'
import { Float, FloatArrow } from '@headlessui-float/vue'
import { ref } from 'vue'

defineProps({
  arrow: { default: false, type: Boolean },
  flip: { default: 5, type: Number },
  mode: { default: 'click', type: String },
  offset: { default: 0, type: Number },
  placement: { default: 'bottom-start', type: String },
  shift: { default: 60, type: Number },
  zIndex: { default: 30, type: Number },
})

function useHoverMenu(delay = 150) {
  const show = ref(false)
  const timer = ref(null)

  const open = () => {
    if (timer.value !== null) {
      clearTimeout(timer.value)
      timer.value = null
    }
    show.value = true
  }

  const close = () => (show.value = false)

  const delayClose = () => {
    timer.value = setTimeout(() => {
      show.value = false
    }, delay)
  }

  return { close, delayClose, open, show, timer }
}

const { close: closeHoverMenu, delayClose: delayCloseHoverMenu, open: openHoverMenu, show: showHoverMenu } = useHoverMenu()
</script>
