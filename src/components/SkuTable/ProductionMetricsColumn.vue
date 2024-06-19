<template>
  <b-field grouped v-if="showMetrics">
    <div class="control">
      <b-taglist attached>
        <b-tag class="is-info" rounded>Bundling Time</b-tag>
        <b-tag class="has-text-weight-bold is-light is-info" rounded>
          {{ formattedBundlingTime }}
        </b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script setup>
import { useReplenishmentStore } from '@/stores'
import humanizeDuration from 'humanize-duration'
import { computed } from 'vue'

const props = defineProps({
  bundlingAverage: [Number, String],
  sku: String,
})
const replenishmentStore = useReplenishmentStore()
const { getReplenishmentQuantity } = replenishmentStore

const replenishmentQuantity = computed(() => getReplenishmentQuantity(props.sku))

const showMetrics = computed(() => props.bundlingAverage && !Number.isNaN(parseFloat(props.bundlingAverage)))

const formattedBundlingTime = computed(() => {
  if (showMetrics.value) {
    const timeInSeconds = (replenishmentQuantity.value / props.bundlingAverage) * 3600
    return humanizeDuration(timeInSeconds * 1000, {
      round: true,
      units: ['h', 'm'],
    })
  }
  return ''
})
</script>
