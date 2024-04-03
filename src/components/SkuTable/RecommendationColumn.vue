<template>
  <b-field grouped>
    <div class="control">
      <b-taglist attached group-multiline>
        <b-tag rounded :class="[runRateDuration === '7d' ? 'is-info' : '']">&nbsp;7 Day</b-tag>
        <b-tag rounded :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '7d' ? 'is-info' : '']">{{
          useFormatter.number(recommendation7d)
        }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag rounded :class="[runRateDuration === '30d' ? 'is-info' : '']">30 Day</b-tag>
        <b-tag rounded :class="['has-text-weight-bold w-12', 'is-light', runRateDuration === '30d' ? 'is-info' : '']">{{
          useFormatter.number(recommendation30d)
        }}</b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script setup>
import { useFormatter } from '@/composables'

const props = defineProps({
  recommendation7d: Number,
  recommendation30d: Number,
  runRateDuration: String,
})
</script>
